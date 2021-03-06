const { createError, json } = require('micro')
const { join: joinPath, dirname: dirnameForPath } = require('path')
const { writeFile, mkdirs, exists, remove } = require('fs-extra')
const { router, ...handlers } = require('microrouter')
const configureDebug = require('debug')

const projectsPath = process.env.PROJECTS_PATH || '/projects'

const decode = encoded => Buffer.from(encoded, 'base64').toString()
const debug = configureDebug('upload-project-files')

const notFound = () => {
  throw createError(404, 'not found')
}

const log = (handler) => (req, res) => {
  debug('%O', { method: req.method, url: req.url })
  return handler(req, res)
}

const deleteProject = projectsPath => async (req, res) => {
  const { filePath } = req.params
  const projectPath = joinPath(projectsPath, filePath)
  if (!await exists(projectPath)) throw createError(404, 'not found')
  await remove(projectPath)
  return { filePath }
}

const createProjectFile = projectsPath => async (req, res) => {
  const file = await json(req, { limit: '100mb' })
  if (!file || !file.content) throw createError(400, 'bad request')

  const { filePath } = req.params
  const projectFilePath = joinPath(projectsPath, filePath)
  const fileDirname = dirnameForPath(projectFilePath)
  if (!await exists(fileDirname)) await mkdirs(fileDirname)
  await writeFile(projectFilePath, decode(file.content))

  return { filePath }
}

const methods = ['get', 'post', 'put', 'patch', 'del', 'head', 'options']

const createRouter = projectsPath => log(router(
  handlers.del('/:filePath', deleteProject(projectsPath)),
  handlers.put('/:filePath', createProjectFile(projectsPath)),
  handlers.get('/healthz', () => ({ ok: true })),
  ...methods.map(method => handlers[method]('/*', notFound))
))

module.exports = createRouter(projectsPath)

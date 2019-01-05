import test from 'ava'
import listen from 'test-listen'
import micro from 'micro'
import request from 'axios'
import { readFile, exists, remove } from 'fs-extra'

import routes from './index'

const encode = decoded => Buffer.from(decoded).toString('base64')

test.before(async t => {
  await remove('/tmp/projects')
})

test.serial('reports health', async t => {
  const url = await listen(micro(routes))
  const response = await request.get(`${url}/healthz`)
  t.truthy(response.data.ok)
})

test.serial('adds file to project', async t => {
  const url = await listen(micro(routes))
  await request.put(
    `${url}/test-project/foo.txt`,
    { content: encode('hello') }
  )
  const content = await readFile('/tmp/projects/test-project/foo.txt', 'utf8')
  t.is(content, 'hello')
})

test.serial('deleted project', async t => {
  const url = await listen(micro(routes))

  await request.put(
    `${url}/test-project/foo.txt`,
    { content: encode('hello') }
  )
  await request.put(
    `${url}/test-project/bar.txt`,
    { content: encode('hello') }
  )

  t.truthy(await exists('/tmp/projects/test-project/foo.txt'))
  t.truthy(await exists('/tmp/projects/test-project/bar.txt'))
  await request.delete(`${url}/test-project/foo.txt`)
  t.truthy(await exists('/tmp/projects/test-project'))
  t.falsy(await exists('/tmp/projects/test-project/foo.txt'))
  await request.delete(`${url}/test-project`)
  t.falsy(await exists('/tmp/projects/test-project'))
})

# upload project files [![CircleCI](https://circleci.com/gh/possibilities/upload-project-files.svg?style=svg)](https://circleci.com/gh/possibilities/upload-project-files)

a minimal api for uploading project files into clusterspace

## endpoints

#### `PUT /:filePath`

upload file to project

##### Body

```
{
  content: base 64 string
}
```

#### `DELETE /:filePath`

delete project

## configuration

the service can be configured via environment variables

#### `PROJECTS_PATH` (default: `/projects`)

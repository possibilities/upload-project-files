# upload project files

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

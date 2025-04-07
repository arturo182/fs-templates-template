# Fluxscape Project Template Provider Template

A template showing how to create a project template provider page.

## Adding templates

Create a new directory, add your template .zip and an icon for it.
Then copy the `template.json` from the `simple_hello_world` directory and modify as needed.
The paths used in that file are relative to your template's directory.

## Generating the template provider

You can generate the provider using the `generate-provider.js` script. The provider needs to be hosted on a server, you must provide the base url of the server to the script:

```sh
  $ node generate-provider.js http://www.example.com/
```

This will iterate all the templates in the repo, copy the files and generate the library json file. The result will be available in the `static` directory.

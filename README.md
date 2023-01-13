# Image Generator EAbstraction Layer

This repo is meant as an initial prototype of image generation APIs abstraction. The goal is to provide a common interface for image generation APIs, so that the same code can be used with different APIs.

At the moment it supports in-browser generation, but will soon support node.js as well.

## Getting started

1. `npm install`

That's about it. You can now run the UI, or the CLI.

Side note - after the first intallation you might need to run `npm rebuild`  to get the CLI command ready for use.

You will need a Dall-E API key to be able to use the UI. No, you are not getting mine.

At the moment it is not deployed anywhere, so you will need to run it locally.

## Structure

The monorepo has 3 packages:

- `igel-ai` - the core package, which contains the abstraction layer and the plugins
- `igel-ai-babylon-ui` - UI which uses the abstraction layer and the engine plugins
- `igel-ai-cli` - a CLI tool, which uses the abstraction layer and the engine plugins

## Using the UI

To run the demo app (in dev mode) run:

`npm run dev -w igel-ai-babylon-ui`

You can now access the UI locally.

The UI supports text to image generation, image variation and inpainting.
Another options is a seamless texture generation. What it does is:

- It generates a texture based on your prompt
- It cuts this image to 4 squares and moves them across one another.
- It generates a cross-mask in the right size.
- It applies the mask to the image, uses it with the inpainting API.

This texture can now be used as a seamless texture in a 3D scene.

## Using the CLI

To run the CLI tool run:

`npx igel`

Of course this is after running `npm install` and `npm rebuild`.

Run this command to get help on each command of the CLI.

## Adding a new plugin

In the `igel-ai` package you will find a plugins folder. Add your plugin there, implement the API, modify the interfaces if needed, and you are good to go.

## why are you misspelling Abstraction

Because otherwise it won't make sense. Igel is the german word for Hedgehog. And Igal is a hebrew name. In this case I preferred the hedgehog.

## License

Apache 2.0

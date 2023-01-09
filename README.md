# Image Generator EAbstraction Layer

This repo is meant as an initial prototype of image generation APIs abstraction. The goal is to provide a common interface for image generation APIs, so that the same code can be used with different APIs.

At the moment it supports in-browser generation, but will soon support node.js as well.

## Getting started

1. `npm install`

That's about it.

To run the demo app:

`npm run dev -w igel-ai-babylon-ui`

## Adding a new plugin

In the `igel-ai` package you will find a plugins folder. Add your plugin there, implement the API, modify the interfaces if needed, and you are good to go.

## whya re you misspelling Abstraction

Because otherwise it won't make sense. Igel is the german word for Hedgehog. And Igal is a hebrew name. In this case I preferred the hedgehog.

## License

Apache 2.0
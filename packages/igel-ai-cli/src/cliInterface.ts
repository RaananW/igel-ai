
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ImageGenerator, OpenAIImageGeneratorPlugin, StableDiffusionImageGeneratorPlugin, SupportedEngines } from "igel-ai";
import {
    loadFile,
    saveFile,
    imageToFileObject,
} from "igel-ai/dist/nodejs.js";
import * as fs from "fs";
import * as path from "path";

import type { AxiosError } from "axios";

function getEngine(engine: string): SupportedEngines {
    switch (engine.toLowerCase()) {
        case SupportedEngines.STABLEDIFFUSION.toLowerCase():
            return SupportedEngines.STABLEDIFFUSION;
        // case SupportedEngines.DEEPAI.toLowerCase():
        //     return SupportedEngines.DEEPAI;
        case SupportedEngines.OPENNI.toLowerCase():
        default:
            return SupportedEngines.OPENNI;
    }
}

function addPlugin(engine: SupportedEngines, generator: ImageGenerator, apiKey: string) {
    switch (engine) {
        case SupportedEngines.STABLEDIFFUSION:
            generator.addPlugin(new StableDiffusionImageGeneratorPlugin(apiKey));
            break;
        // case SupportedEngines.DEEPAI:
        //     generator.addPlugin(new DeepAIImageGeneratorPlugin());
        //     break;
        case SupportedEngines.OPENNI:
        default:
            generator.addPlugin(new OpenAIImageGeneratorPlugin(apiKey));
            break;
    }
}

function processImagePath(imagePath: string) {
    if (!imagePath) {
        throw new Error("No image path provided");
    }
    if (imagePath.startsWith("http")) {
        return imagePath;
    }
    return imageFileToBase64(imagePath);
}

function imageFileToBase64(imagePath: string) {
    const image = fs.readFileSync(imagePath);
    const dataUrl = `data:image/${path.extname(imagePath).replace(".", "")};base64,${image.toString('base64')}`;
    return dataUrl;
}

// const argv = yargs(hideBin(process.argv)).argv;

// const argv = await yargs(hideBin(process.argv)).options({
//     command: { type: 'string' },
//     engine: { type: 'string' },
//     key: { type: 'string' },
//     prompt: { type: 'string' },
// }).argv;

void yargs(hideBin(process.argv))
    .command('text-to-image <prompt>', 'Generate an image from text',
        (yargs) => {
            return yargs.positional('prompt', {
                describe: 'The prompt to use',
                type: 'string',
                default: 'A 3D scene of a panda on a lion in a forest',
            });
        }, (argv) => {
            const engine = getEngine(argv.engine as string);
            const apiKey = process.env[`${engine}_key`] || argv.key as string;
            const generator = new ImageGenerator(
                {
                    loadFile,
                    saveFile,
                    imageToFileObject,
                }
            )
            addPlugin(engine, generator, apiKey);
            const prompt = argv.prompt;
            generator.textToImage(prompt, {
                resultsLength: argv.count as number
            }, engine).then((image) => {
                console.log(image);
            }).catch((error: AxiosError) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                }
            });
        })
    .command('image-variation <imagePath>', 'Generate an image variation', (yargs) => {
        return yargs
            .positional('imagePath', {
                description: 'Local path or URL of the input image',
                type: 'string',
            })
    }, (argv) => {
        const engine = getEngine(argv.engine as string);
        const apiKey = process.env[`${engine}_key`] || argv.key as string;
        const generator = new ImageGenerator(
            {
                loadFile,
                saveFile,
                imageToFileObject,
            }
        )
        addPlugin(engine, generator, apiKey);
        generator.imageToImage(argv.prompt || "", {
            image: processImagePath(argv.imagePath as string),
            resultsLength: argv.count as number
        }, engine).then((image) => {
            console.log(image);
        }).catch((error: AxiosError) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }
        });
    })
    .command('inpainting <prompt> <imagePath> [maskPath]', 'Generate an image variation', (yargs) => {
        return yargs
            .positional('prompt', {
                describe: 'The prompt to use',
                type: 'string',
                default: 'A 3D scene of a panda on a lion in a forest',
            })
            .positional('imagePath', {
                description: 'Local path or URL of the input image',
                type: 'string',
            })
            .positional('maskPath', {
                description: 'Local path or URL of the input mask',
                type: 'string',
            })
    }, (argv) => {
        const engine = getEngine(argv.engine as string);
        const apiKey = "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" || process.env[`${engine}_key`] || argv.key as string;
        const generator = new ImageGenerator(
            {
                loadFile,
                saveFile,
                imageToFileObject,
            }
        )
        addPlugin(engine, generator, apiKey);
        const prompt = typeof argv.prompt === "string" ? argv.prompt : (argv.prompt as string[]).join(" ");
        generator.inpainting(prompt, {
            image: processImagePath(argv.imagePath as string),
            mask: argv.maskPath ? processImagePath(argv.maskPath) : undefined,
            resultsLength: argv.count as number
        }, engine).then((image) => {
            console.log(image);
        }).catch((error: AxiosError) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }
        });
    })
    .option('key', {
        alias: 'k',
        description: 'The API key to use. default to env "EngineName_key"',
        type: 'string',
    })
    .option('engine', {
        alias: 'e',
        description: 'The engine to use',
        type: 'string',
        choices: Object.values(SupportedEngines),
        default: SupportedEngines.OPENNI,
    })
    .option('count', {
        alias: 'c',
        description: 'the number of images to return',
        type: 'number',
        default: 1,
    })
    // .option('prompt', {
    //     alias: 'p',
    //     description: 'The prompt to use',
    //     type: 'string',
    //     default: 'A 3D scene of a pando riding a lion in a snowy forest'
    // })
    .demandCommand()
    .help()
    .argv;



// const command = argv.command as string;
// const engine = argv.engine as SupportedEngines;
// const engineLowCase = engine.toLowerCase();


// switch (engineLowCase) {
//     case SupportedEngines.OPENNI.toLowerCase():
//     default:
//         generator.addPlugin(new OpenAIImageGeneratorPlugin(apiKey));
//         break;
// }

// console.log(argv.prompt);

// generator.textToImage(argv.prompt as string, {}, engine).then((image) => {
//     console.log(image);
// }).catch((err) => {
//     console.error(err);
// });
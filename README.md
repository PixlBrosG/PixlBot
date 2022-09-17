# pixlbot
#### discord bot
general commands, utility, games and music

#### [Add me to your discord server!](https://discord.com/api/oauth2/authorize?client_id=744015666029396028&permissions=8&scope=bot)

## General

Changelog starts counting from version 5.0.0 as previous progress hasn't been explicitely documented

## Changelog

### Version 5.0.0

#### Updated packages

Package              | From   | To
-------------------- | ------ | ------
[@discordjs/opus]    | 0.7.0  | 0.8.0
[@discordjs/voice]   | 0.8.8  | 0.11.0
[discord.js]         | 13.6.0 | 14.3.0
[dotenv]             | 16.0.0 | 16.2.0
[ffmpeg-static]      | 5.0.2  | 5.1.0
[libsodium]          | 0.7.9  | 0.7.10
[libsodium-wrappers] | 0.7.9  | 0.7.10
[node-fetch]         | 3.2.2  | 3.2.10

#### Chatbot
Added external AI for generating replies based on previous messages and current message
Uses [DiabloGPT-Large] model by [Microsoft] through [Huggingface]

#### Command Loader
Commands are now loaded in [commandloader] instead of [help] and [commandhandler]
This is done to improve both readability and performance

#### Removed Exports
The exports "name" and "category" has been removed from commands
Command loader uses folder and file name to categorize commands

#### Revamped file system
Commands now come budled in folders for each category
i.e. music commands are now in src/cmd/music folder

Commands folder renamed to cmd for convenience

#### General Bug Fixes And Performance Improvements
Kinda self-explanitory, also idk what i did tbh

#### Hidden command category
This category is reserved for W.I.P., experimental and debug commands
Debug commands may be used to access sensitive memory

[//]: # (Variables)

[@discordjs/opus]: https://npmjs.com/package/@discordjs/opus
[@discordjs/voice]: https://npmjs.com/package/@discordjs/voice
[discord.js]: https://npmjs.com/package/discord.js
[dotenv]: https://npmjs.com/package/dotenv
[ffmpeg-static]: https://npmjs.com/package/ffmpeg-static
[libsodium]: https://npmjs.com/package/libsodium
[libsodium-wrappers]: https://npmjs.com/package/libsodium-wrappers
[node-fetch]: https://npmjs.com/package/node-fetch

[DiabloGPT-Large]: https://api-inference.huggingface.co/models/microsoft/DialoGPT-large
[Microsoft]: https://microsoft.com
[Huggingface]: https://huggingface.co

[commandloader]: https://github.com/PixlBrosG/PixlBot/blob/master/src/commandloader.js
[commandhandler]:https://github.com/PixlBrosG/PixlBot/blob/master/src/commandhandler.js
[help]: https://github.com/PixlBrosG/PixlBot/blob/master/src/cmd/commands/help.js
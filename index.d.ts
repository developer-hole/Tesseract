declare module 'tesseract' {

    import { ExecOptions } from 'child_process';

    import {
        Client,
        Message,
        ClientOptions,
    } from 'discord.js';

    export const version: string;

    //#region Classes

    export class TesseractClient extends Client {
        public constructor(options?: TesseractClientOptions);
        public login(token?: string): Promise<string>;
        public static use(mod: any): typeof TesseractClient;
    }

    export { TesseractClient as Client };

    export class Command {
        public constructor(client: TesseractClient, file: string[], options?: CommandOptions);
        public run(arg: string | undefined, message: Message): any;
    }

    export  class Event {
        public constructor(client: TesseractClient, file: string[], options?: EventOptions);
        public emitter: NodeJS.EventEmitter;
        public event: string;
        public once: boolean;
        private _listener: Function;
        
        public run(...params: any[]): void;

        private _run(param: any): void;
        private _runOnce(...args: any[]): Promise<void>;
        private _listener(): void;
        private _unlisten(): void;
    }

    //#endregion Classes

    //#region Typedefs

    export interface TesseractClientOptions extends ClientOptions {
        commandsDir?: string;
        eventsDir?: string;
        prefix: string;
        owners: string[];
        database?: DatabaseOptions;
    }

    export interface DatabaseOptions {
        name?: string;
        uri?: string;
    }

    export interface CommandOptions {
        name?: string;
        usage: string;
        description?: string;
        extendedHelp?: string;
        aliases?: string[];
        enabled?: boolean;
        category?: string;
        userPerms?: string[];
        botPerms?: string[];
    }

    export interface Options {
        enabled?: boolean;
        name?: string;
    }

    export interface EventOptions extends Options {
        emitter?: NodeJS.EventEmitter;
        event?: string;
        once?: boolean;
    }
}

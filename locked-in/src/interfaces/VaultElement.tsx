export enum ElementType {
    File = 'File',
    Text = 'Text'
}

export interface VaultElementInterface {
    id: number;
    name: string;
    type: ElementType;
    fileName: string;
    // TODO - store hashed string!!
    secret: string;
}
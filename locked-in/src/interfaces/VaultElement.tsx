export enum ElementType {
    File = 'File',
    String = 'Text'
}

export interface VaultElementInterface {
    id: number;
    name: string;
    type: ElementType;
}

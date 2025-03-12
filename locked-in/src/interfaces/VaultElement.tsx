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

// TODO - this will be handled by backend!
export let VaultData: VaultElementInterface[] = [
    // {id: 1, name: "key", type: ElementType.String, secret: "pubKey"},
    // {id: 2, name: "Health Card Number", type: ElementType.String, secret: "121323127"},
    // {id: 3, name: "DriversLicense", type: ElementType.String, secret: "28130912823"},
];
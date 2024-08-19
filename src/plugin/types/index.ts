export interface JEvent {
    name: string,
    messageType?: string,
    message?: string,
    data?: any,
}

export interface JsonDragProps {
    group: string,
    text?: string,
    modelValue?: JsonProperty[],
    level?: number,
    name?: string,
    type?: string,
}

export interface JsonDropProps {
    group: string,
    modelValue?: JsonProperty[],
    level?: number,
    name?: string,
    type?: string,
    isOpen?: boolean,
    copyItem?: JsonProperty,
    globalId: number,
}

export interface JsonEditorProps {
    modelValue: string,
    width?: number | string | undefined,
    height?: number | string | undefined,
    readOnly: boolean,
}

export interface JsonDragNDropProps {
    group: string,
    modelValue?: JsonProperty[],
    jsonString: string,
    title?: string,
    dragPanelTitle?: string,
    dropPanelTitle?: string,
    height?: number | string | undefined,
    placeholderItems?: PlaceholderItem[]
}

export type JTypes = 'string' | 'number' | 'boolean' | 'object' | 'array';
export type JTypeNature = 'value' | 'object';

export interface PlaceholderItem {
    title: string,
    type: JTypes,
    token: string,
}

export interface JsonProperty {
    id: number,
    key: string,
    path?: string | null,
    value?: any,
    type: JTypes,
    typeNature?: JTypeNature,
    disabled: boolean,
    isCustom: boolean,
    isOpen: boolean,
    children: JsonProperty[],
}

export interface PropertyTypeItem {
    key: string,
    type: JTypes,
    title: string,
    canEdit: boolean,
    hide: boolean,
    typeNature?: JTypeNature,
    placeholderToken?: string,
}

export interface EditDialog {
    refObj?: JsonProperty,
    selectedType?: PropertyTypeItem,
    key: string,
    value: any,
    isCustom: boolean,
}

export interface ViewDialog {
    modelValue: string,
    isEdit: boolean,
}

export interface EditJProperty {
    element: JsonProperty,
    index: number,
    level: number,
}
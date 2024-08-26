export interface JEvent {
    name: string,
    messageType?: string,
    message?: string,
    data?: any,
}

export interface JsonDragNDropProps {
    group: string,
    modelValue?: JsonProperty[],
    jsonString: string,
    title?: string,
    dragPanelTitle?: string,
    dropPanelTitle?: string,
    height?: number | string | undefined,
    placeholderItems?: PlaceholderItem[],
    expandIcon: string,
    collapsedIcon: string,
    copyIcon: string,
    pasteIcon: string,
    addIcon: string,
    editIcon: string,
    deleteIcon: string,
    saveIcon: string,
    cancelIcon: string,
    validateIcon: string,
    formatIcon: string,
    importIcon: string,
}

export interface JsonDragProps {
    group: string,
    text?: string,
    modelValue?: JsonProperty[],
    level?: number,
    name?: string,
    type?: string,
    expandIcon: string,
    collapsedIcon: string,
    copyIcon: string,
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
    expandIcon: string,
    collapsedIcon: string,
    copyIcon: string,
    pasteIcon: string,
    addIcon: string,
    editIcon: string,
    deleteIcon: string,
}

export interface JsonEditorProps {
    modelValue: string,
    width?: number | string | undefined,
    height?: number | string | undefined,
    readOnly: boolean,
}

export type JTypes = 'string' | 'number' | 'boolean' | 'object' | 'array';
export type JParentType = 'array' | 'object';

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
    parentType?: JParentType,
    disabled: boolean,
    isCustom: boolean,
    isOpen: boolean,
    children?: JsonProperty[],
}

export interface PropertyTypeItem {
    key: string,
    type: JTypes,
    title: string,
    canEdit: boolean,
    hide: boolean,
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
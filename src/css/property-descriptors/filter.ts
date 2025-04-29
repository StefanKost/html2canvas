import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentWithValue, CSSFunction, isCSSFunction} from '../syntax/parser';
import {isLength, Length} from '../types/length';
import {Context} from "../../core/context";

export type Filter = FilterItem[];
export interface FilterItem {
    name: string;
    value: Length;
}

export const filter: IPropertyListDescriptor<Filter | null> = {
    name: 'filter',
    initialValue: 'none',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]) => {
        if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {
            return null;
        }

        const filter: Filter = [];

        let hasFilter: boolean = false;

        tokens.filter(isCSSFunction).forEach((token: CSSFunction) => {
            for (let index = 0; index < token.values.length; index++) {
                const value: CSSValue = token.values[index];
                if (isLength(value)) {
                    hasFilter = true;
                    filter.push({name: token.name, value: value});
                }
            }
        });

        if (hasFilter) {
            return filter;
        } else {
            return null;
        }
    }
};

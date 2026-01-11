import React from 'react';
import { IFieldWithoutSubSection, FieldType, IKeyValueField, IDateField, ILinkField } from '@/lib/page.types';
import { CustomInput } from '@/admin/components/CustomInput';

interface KeyValueEditorProps {
  block: IKeyValueField | ILinkField | IDateField;
  onChange: (updates: Partial<IKeyValueField | ILinkField | IDateField>) => void;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ block, onChange }) => {
  const isLink = block.type === FieldType.LINK;
  const isDate = block.type === FieldType.DATE;

  return (
    <div className="flex gap-4 items-end">
      <CustomInput
        label={isLink ? "Link Text" : isDate ? "Date Label" : "Key"}
        placeholder={isLink ? "Apply Online" : isDate ? "Last Date to Apply" : "Field Name..."}
        value={block.key || ''}
        onChange={(e) => onChange({ key: e.target.value })}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex-1"
      />
      <CustomInput
        label={isLink ? "URL" : isDate ? "Pick Date" : "Value"}
        type={isDate ? "date" : "text"}
        placeholder={isLink ? "https://..." : "Value..."}
        value={block.value || ''}
        onChange={(e) => onChange({ value: e.target.value })}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex-1"
      />
    </div>
  );
};
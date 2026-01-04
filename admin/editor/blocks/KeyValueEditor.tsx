import React from 'react';
import { ContentBlock, BlockType } from '@/admin/types';
import { CustomInput } from '@/admin/components/CustomInput';

interface KeyValueEditorProps {
  block: ContentBlock;
  onChange: (updates: Partial<ContentBlock>) => void;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ block, onChange }) => {
  const isLink = block.type === BlockType.LINK;
  const isDate = block.type === BlockType.DATE;

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
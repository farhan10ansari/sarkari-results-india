import React, { useState } from 'react';
import { BlockWrapper } from '@/admin/editor/BlockWrapper';
import { KeyValueEditor } from '@/admin/editor/blocks/KeyValueEditor';
import { MarkdownEditor } from '@/admin/editor/blocks/MarkdownEditor';
import { TableEditor } from '@/admin/editor/blocks/TableEditor';
import { usePageStore } from '@/admin/usePageStore';
import { FieldType, IFieldWithoutSubSection } from '@/lib/page.types';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface BlockEditorProps {
  sectionId: string;
  subSectionId?: string;
  block: IFieldWithoutSubSection;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = (props) => {
  const { block, sectionId, subSectionId, index } = props;
  const { updateBlock, deleteChild, moveChild } = usePageStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdate = (updates: Partial<IFieldWithoutSubSection>) => {
    updateBlock(sectionId, block._id, updates, subSectionId);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteChild(sectionId, block._id, subSectionId);
    setShowDeleteDialog(false);
  };

  const handleMoveUp = () => moveChild(sectionId, index, 'up', subSectionId);
  const handleMoveDown = () => moveChild(sectionId, index, 'down', subSectionId);

  const renderInnerEditor = () => {
    switch (block.type) {
      case FieldType.KEY_VALUE:
      case FieldType.DATE:
      case FieldType.LINK:
        return <KeyValueEditor block={block} onChange={handleUpdate} />;
      case FieldType.MARKDOWN:
        return <MarkdownEditor block={block} onChange={handleUpdate} />;
      case FieldType.TABLE:
        return <TableEditor block={block} onChange={handleUpdate} />;
      default:
        return <div className="text-xs text-red-500">Unknown block type</div>;
    }
  };

  return (
    <>
      <BlockWrapper
        {...props}
        onDelete={handleDeleteClick}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      >
        {renderInnerEditor()}
      </BlockWrapper>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Block"
        description="Are you sure you want to delete this block? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
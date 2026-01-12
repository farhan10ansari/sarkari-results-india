import React from "react";
import ReactMarkdown from "react-markdown";
import { ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { FieldType, IFieldWithoutSubSection, ISection } from "@/lib/page.types";

interface PreviewSectionProps {
  section: ISection;
}

const BlockRenderer: React.FC<{ block: IFieldWithoutSubSection }> = ({ block }) => {
  switch (block.type) {
    case FieldType.MARKDOWN:
      return (
        <div className="prose prose-sm max-w-none text-slate-800 dark:text-slate-200 prose-headings:dark:text-white mb-4">
          <ReactMarkdown>{block.value || ""}</ReactMarkdown>
        </div>
      );

    case FieldType.KEY_VALUE:
    case FieldType.DATE:
      return (
        <div className="flex justify-between items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
          <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {block.type === FieldType.DATE && (
              <Calendar className="w-4 h-4 text-blue-500" />
            )}
            {block.key}
          </span>
          <span className="text-slate-700 dark:text-slate-300 text-right">
            {block.value}
          </span>
        </div>
      );

    case FieldType.LINK:
      return (
        <a
          href={block.value}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition mb-3"
        >
          <span className="font-bold text-blue-900 dark:text-blue-200">
            {block.key}
          </span>
          <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </a>
      );

    case FieldType.TABLE:
      if (!block.tableData?.columns.length) return null;

      return (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                {block.tableData.columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-t border-slate-200 dark:border-slate-800">
                  {block.tableData.columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
};

export const PreviewSection: React.FC<PreviewSectionProps> = ({ section }) => {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
        <h3 className="text-lg font-black flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          {section.title}
        </h3>
      </header>

      <div className="p-6 space-y-6">
        {section.children.map(child =>
          child.type === "SUB_SECTION" ? (
            <div key={child._id}>
              <h4 className="font-bold mb-4 uppercase tracking-wide">
                {child.title}
              </h4>
              {child.children.map(block => (
                <BlockRenderer key={block._id} block={block} />
              ))}
            </div>
          ) : (
            <BlockRenderer key={child._id} block={child as IFieldWithoutSubSection} />
          )
        )}
      </div>
    </section>
  );
};

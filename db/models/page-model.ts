import mongoose, { Schema, Model } from 'mongoose';
import { IPage, PageType, SectionType, PageStatus } from '@/lib/page.types';

const PageSchema = new Schema<IPage>(
  {
    schemaVersion: {
      type: Number,
      default: 1,
      required: true,
    },
    _id: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(PageType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PageStatus),
      default: PageStatus.DRAFT,
    },
    displayConfig: {
      type: Object,
      default: {},
    },
    metadata: {
      type: Object,
      default: {},
    },
    category: {
      type: String,
      trim: true,
    },
    importantDates: {
      type: Object,
      default: {},
    },
    sections: [
      {
        _id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: Object.values(SectionType),
          required: true,
        },
        children: {
          type: [Schema.Types.Mixed],
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PageSchema.index({ slug: 1 });
PageSchema.index({ type: 1 });
PageSchema.index({ updatedAt: -1 });
PageSchema.index({ status: 1 });

// Prevent model overwrite in Next.js hot reload
const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;

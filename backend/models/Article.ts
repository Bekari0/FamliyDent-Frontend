import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
 title: { type: String, required: true },
 excerpt: String,
 content: { type: String, required: true },
 image: String,
 category: String,
 status: { type: String, enum: ['draft', 'published'], default: 'published' },
 author: String,
 date: { type: Date, default: Date.now },
 readTime: String,
 tags: [String]
}, {
 timestamps: true
});

export const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

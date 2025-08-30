import React, { useState, useEffect } from 'react';
import { API_BASE } from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState({ content: '', title: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // In a real app, you'd fetch from your backend API
                    const response = await fetch(`${API_BASE}/api/posts/${slug}`);
                if (!response.ok) {
                    throw new Error('Beitrag nicht gefunden');
                }
                const markdown = await response.text();
                const title = markdown.split('\n')[0].replace(/^#\s*/, '');
                setPost({ content: markdown, title });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return <div className="text-center p-10">Lade Beitrag...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Fehler: {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>{`${post.title} - ZOE Solar Blog`}</title>
                <meta name="description" content={`Blogbeitrag von ZOE Solar zum Thema: ${post.title}`} />
            </Helmet>

            <div className="mb-8">
                <Link to="/blog" className="flex items-center text-blue-600 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zurück zur Blog-Übersicht
                </Link>
            </div>

            <article className="prose lg:prose-xl max-w-none bg-white p-8 rounded-lg shadow-md">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                </ReactMarkdown>
            </article>
        </div>
    );
};

export default BlogPost;

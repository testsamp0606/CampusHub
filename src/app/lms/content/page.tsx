
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { courseContentData as initialContentData, coursesData as initialCoursesData } from '@/lib/data';
import type { CourseContent, Course } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search, Video, File, Link as LinkIcon } from 'lucide-react';

type EnrichedContent = CourseContent & {
    courseTitle: string;
};

export default function ContentPage() {
    const [content, setContent] = useState<CourseContent[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setContent(JSON.parse(localStorage.getItem('courseContentData') || JSON.stringify(initialContentData)));
        setCourses(JSON.parse(localStorage.getItem('coursesData') || JSON.stringify(initialCoursesData)));
    }, []);

    const enrichedContent = useMemo(() => {
        const coursesMap = new Map(courses.map(c => [c.id, c.title]));
        return content.map(item => ({
            ...item,
            courseTitle: coursesMap.get(item.courseId) || 'Unknown Course',
        }));
    }, [content, courses]);

    const filteredContent = useMemo(() => {
        return enrichedContent.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [enrichedContent, searchQuery]);

    const getTypeIcon = (type: CourseContent['type']) => {
        switch (type) {
            case 'Video': return <Video className="h-4 w-4 text-blue-500" />;
            case 'Document': return <File className="h-4 w-4 text-green-500" />;
            case 'Link': return <LinkIcon className="h-4 w-4 text-purple-500" />;
            default: return <File className="h-4 w-4" />;
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Content Library</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Learning Materials</CardTitle>
                    <CardDescription>A complete library of all uploaded content across all courses.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search by title, course, or type..."
                        className="w-full rounded-lg bg-background pl-8 md:w-1/3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content Title</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Duration/Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {filteredContent.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.courseTitle}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                            {getTypeIcon(item.type)} {item.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.type === 'Video' ? `${item.duration} mins` : <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{item.url}</a>}</TableCell>
                                </TableRow>
                            ))}
                            {filteredContent.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                    No content found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

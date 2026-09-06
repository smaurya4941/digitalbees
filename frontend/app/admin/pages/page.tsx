'use client';

import { useState } from 'react';
import { usePages } from '@/lib/admin/pages';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PagesAdminList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePages(page);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Manage the content of your dynamic pages.
          </p>
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[300px]">URL Path</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Template</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No pages found. Run the database seeders!
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((pageData) => (
                <TableRow key={pageData.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-sm">
                    {pageData.url_path}
                  </TableCell>
                  <TableCell>{pageData.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pageData.status === 'published'
                          ? 'default'
                          : pageData.status === 'draft'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {pageData.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-mono">
                      {pageData.template_key || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={pageData.url_path} target="_blank" rel="noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/pages/${pageData.id}`}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {data?.meta && data.meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{data.meta.from}</span> to{' '}
              <span className="font-medium">{data.meta.to}</span> of{' '}
              <span className="font-medium">{data.meta.total}</span> pages
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page === data.meta.last_page}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns, AuditLogRecord } from './columns';
import {
  useAuditTableFilters
} from './use-audit-table-filters';

export default function AuditTable({
  data,
  totalData
}: {
  data: AuditLogRecord[];
  totalData: number;
}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery
  } = useAuditTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}

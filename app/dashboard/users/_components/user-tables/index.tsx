'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns, DataPrincipal } from './columns';
import {
  useUserTableFilters
} from './use-user-table-filters';

export default function UserTable({
  data,
  totalData
}: {
  data: DataPrincipal[];
  totalData: number;
}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery
  } = useUserTableFilters();

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

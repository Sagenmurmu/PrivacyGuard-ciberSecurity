'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns, ConsentRecord } from './columns';
import {
  useConsentTableFilters
} from './use-consent-table-filters';

export default function ConsentTable({
  data,
  totalData
}: {
  data: ConsentRecord[];
  totalData: number;
}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery
  } = useConsentTableFilters();

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

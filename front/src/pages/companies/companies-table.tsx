import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Company, mapCompany } from '../../interfaces/company.interface';
import { updateCompany } from '../../services/companies';
import ColumnHead from '../../components/table/ColumnHead';
import CompanyChip from '../../components/chips/CompanyChip';
import EditableText from '../../components/table/editable-cell/EditableText';
import {
  FaRegBuilding,
  FaCalendar,
  FaLink,
  FaMapPin,
  FaRegUser,
  FaUsers,
  FaBuilding,
} from 'react-icons/fa';
import PersonChip, {
  PersonChipPropsType,
} from '../../components/chips/PersonChip';
import EditableChip from '../../components/table/editable-cell/EditableChip';
import {
  FilterConfigType,
  SearchConfigType,
  SortType,
} from '../../components/table/table-header/interface';
import { Companies_Order_By } from '../../generated/graphql';
import {
  SEARCH_COMPANY_QUERY,
  SEARCH_USER_QUERY,
} from '../../services/search/search';
import EditableDate from '../../components/table/editable-cell/EditableDate';
import EditableRelation from '../../components/table/editable-cell/EditableRelation';
import { User, mapUser } from '../../interfaces/user.interface';
import { useMemo } from 'react';
import { SelectAllCheckbox } from '../../components/table/SelectAllCheckbox';
import Checkbox from '../../components/form/Checkbox';

export const availableSorts = [
  {
    key: 'name',
    label: 'Name',
    icon: <FaBuilding />,
    _type: 'default_sort',
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: <FaUsers />,
    _type: 'default_sort',
  },
  {
    key: 'domain_name',
    label: 'Url',
    icon: <FaLink />,
    _type: 'default_sort',
  },
  {
    key: 'address',
    label: 'Address',
    icon: <FaMapPin />,
    _type: 'default_sort',
  },
  {
    key: 'created_at',
    label: 'Creation',
    icon: <FaCalendar />,
    _type: 'default_sort',
  },
] satisfies Array<SortType<Companies_Order_By>>;

export const availableFilters = [
  {
    key: 'company_name',
    label: 'Company',
    icon: <FaBuilding />,
    searchConfig: {
      query: SEARCH_COMPANY_QUERY,
      template: (searchInput) => ({
        name: { _ilike: `%${searchInput}%` },
      }),
      resultMapper: (company) => ({
        render: (company) => company.name,
        value: mapCompany(company),
      }),
    },
    selectedValueRender: (company) => company.name,
    operands: [
      {
        label: 'Equal',
        id: 'equal',
        whereTemplate: (company) => ({
          name: { _eq: company.name },
        }),
      },
      {
        label: 'Not equal',
        id: 'not-equal',
        whereTemplate: (company) => ({
          _not: { name: { _eq: company.name } },
        }),
      },
    ],
  } as FilterConfigType<Company, Company>,
  {
    key: 'company_domain_name',
    label: 'Url',
    icon: <FaLink />,
    searchConfig: {
      query: SEARCH_COMPANY_QUERY,
      template: (searchInput) => ({
        name: { _ilike: `%${searchInput}%` },
      }),
      resultMapper: (company) => ({
        render: (company) => company.domain_name,
        value: mapCompany(company),
      }),
    },
    selectedValueRender: (company) => company.domain_name,
    operands: [
      {
        label: 'Equal',
        id: 'equal',
        whereTemplate: (company) => ({
          domain_name: { _eq: company.domain_name },
        }),
      },
      {
        label: 'Not equal',
        id: 'not-equal',
        whereTemplate: (company) => ({
          _not: { domain_name: { _eq: company.domain_name } },
        }),
      },
    ],
  } as FilterConfigType<Company, Company>,
];

const columnHelper = createColumnHelper<Company>();

export const useCompaniesColumns = () => {
  return useMemo(() => {
    return [
      {
        id: 'select',
        header: ({ table }: any) => (
          <SelectAllCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: (props: CellContext<Company, string>) => (
          <Checkbox
            id={`company-selected-${props.row.original.id}`}
            name={`company-selected-${props.row.original.id}`}
            checked={props.row.getIsSelected()}
            onChange={props.row.getToggleSelectedHandler()}
          />
        ),
      },
      columnHelper.accessor('name', {
        header: () => (
          <ColumnHead viewName="Name" viewIcon={<FaRegBuilding />} />
        ),
        cell: (props) => (
          <EditableChip
            value={props.row.original.name}
            placeholder="Name"
            picture={`https://www.google.com/s2/favicons?domain=${props.row.original.domain_name}&sz=256`}
            changeHandler={(value: string) => {
              const company = props.row.original;
              company.name = value;
              updateCompany(company);
            }}
            ChipComponent={CompanyChip}
          />
        ),
      }),
      columnHelper.accessor('employees', {
        header: () => (
          <ColumnHead viewName="Employees" viewIcon={<FaUsers />} />
        ),
        cell: (props) => (
          <EditableText
            content={props.row.original.employees.toFixed(0)}
            changeHandler={(value) => {
              const company = props.row.original;
              company.employees = parseInt(value);
              updateCompany(company);
            }}
          />
        ),
      }),
      columnHelper.accessor('domain_name', {
        header: () => <ColumnHead viewName="URL" viewIcon={<FaLink />} />,
        cell: (props) => (
          <EditableText
            content={props.row.original.domain_name}
            changeHandler={(value) => {
              const company = props.row.original;
              company.domain_name = value;
              updateCompany(company);
            }}
          />
        ),
      }),
      columnHelper.accessor('address', {
        header: () => <ColumnHead viewName="Address" viewIcon={<FaMapPin />} />,
        cell: (props) => (
          <EditableText
            content={props.row.original.address}
            changeHandler={(value) => {
              const company = props.row.original;
              company.address = value;
              updateCompany(company);
            }}
          />
        ),
      }),
      columnHelper.accessor('creationDate', {
        header: () => (
          <ColumnHead viewName="Creation" viewIcon={<FaCalendar />} />
        ),
        cell: (props) => (
          <EditableDate
            value={props.row.original.creationDate}
            changeHandler={(value: Date) => {
              const company = props.row.original;
              company.creationDate = value;
              updateCompany(company);
            }}
          />
        ),
      }),
      columnHelper.accessor('accountOwner', {
        header: () => (
          <ColumnHead viewName="Account Owner" viewIcon={<FaRegUser />} />
        ),
        cell: (props) => (
          <EditableRelation<User, PersonChipPropsType>
            relation={props.row.original.accountOwner}
            searchPlaceholder="Account Owner"
            ChipComponent={PersonChip}
            chipComponentPropsMapper={(
              accountOwner: User,
            ): PersonChipPropsType => {
              return {
                name: accountOwner.displayName,
              };
            }}
            changeHandler={(relation: User) => {
              const company = props.row.original;
              if (company.accountOwner) {
                company.accountOwner.id = relation.id;
              } else {
                company.accountOwner = {
                  id: relation.id,
                  email: relation.email,
                  displayName: relation.displayName,
                };
              }
              updateCompany(company);
            }}
            searchConfig={
              {
                query: SEARCH_USER_QUERY,
                template: (searchInput: string) => ({
                  displayName: { _ilike: `%${searchInput}%` },
                }),
                resultMapper: (accountOwner) => ({
                  render: (accountOwner) => accountOwner.displayName,
                  value: mapUser(accountOwner),
                }),
              } satisfies SearchConfigType<User>
            }
          />
        ),
      }),
    ];
  }, []);
};
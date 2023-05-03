import { IconPlus } from '@tabler/icons-react';
import {
  CatalystConfig,
  CatalystCollection,
} from '../../types';
import { CurrentSubrouteLink } from '../components/CurrentSubrouteLink';
import { CatalystDataObject } from '../../data/types';
import { TableBody } from '../components/browse/TableBody';

type Props<C extends CatalystConfig> = {
  collection: CatalystCollection<C> & { name: string };
  data: CatalystDataObject<C>;
};

export async function BrowsePage<C extends CatalystConfig>({
  collection,
  data,
}: Props<C>) {
  const docs = await data[collection.name].findAsUser({
    autopopulate: true,
  });

  return (
    <div className="flex flex-col p-16 bg-gray-100 h-full">
      <h1 className="text-red-600 font-black text-4xl mb-8 uppercase">
        BROWSE {collection.label}
      </h1>
      <table>
        <thead>
          <tr className="border-b border-gray-300">
            {Object.entries(collection.fields).map(
              ([key, field]) => (
                <th
                  key={key}
                  className="text-left py-2 font-semibold">
                  {field.label}
                </th>
              )
            )}
          </tr>
        </thead>
        <TableBody
          docs={docs}
          collection={collection}
        />
      </table>
      <CurrentSubrouteLink
        href={`/create/${collection.name}`}
        className="absolute right-0 bottom-0 m-16 bg-red-600 text-white p-4 rounded-full hover:bg-red-700">
        <IconPlus />
      </CurrentSubrouteLink>
    </div>
  );
}

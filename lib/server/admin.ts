// Atlas Search Docs: https://www.mongodb.com/docs/atlas/atlas-search/text/#text
import dbConnect from '@/lib/connectdb';
import profile from '@/lib/model/profile';
import { AdminSearchInterface } from '../query/admin';
import { dateXdays } from '../standardized';

const mileInMeters = 1609.344;

const getPivotValue = () => {
  // PIVOT Calculation: score = pivot / (pivot + distance);
  return mileInMeters * 50;
};

export const getAdminSearch = async ({
  pageNum,
  pageLimit,
  searchTerm,
}: AdminSearchInterface) => {
  console.log('getAdminSearch');
  await dbConnect();

  if (searchTerm) {
    const offset = pageLimit * pageNum - pageLimit;
    const skip = pageNum > 1 ? (pageNum - 1) * pageLimit : 0;
    // console.log("skip", skip);
    const aggregateQuery = [
      {
        $search: {
          index: 'profiles-search',
          compound: {
            should: [
              {
                text: {
                  query: searchTerm,
                  path: ['name', 'email'],
                  fuzzy: {
                    maxEdits: 1,
                    maxExpansions: 5,
                  },
                  score: {
                    boost: {
                      value: 5,
                    },
                  },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
          count: {
            type: 'total',
          },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageLimit,
      },
      {
        $project: {
          name: 1,
          slug: 1,
          socials: 1,
          five_words: 1,
          details: 1,
          'images.primaryCDN': 1,
          'primary_address.city': 1,
          geo: 1,
          score: { $meta: 'searchScore' },
          paginationToken: { $meta: 'searchSequenceToken' },
          meta: '$$SEARCH_META',
        },
      },
    ];
    // console.log(aggregateQuery[0]);
    const aggregateList = await profile.aggregate(aggregateQuery);
    if (aggregateList) {
      // console.log(aggregateList);
      return { success: true, data: aggregateList };
    }
    return { success: true, data: [] };
  }
  return { success: false, data: [] };
};

export const getAdminDashboard = async () => {
  await dbConnect();
  // TODO: Remove type assertion after upgrading to Mongoose v8 in Phase 5
  const recentProfiles = await (profile as any)
    .find({ createdAt: { $gte: dateXdays(35) } })
    .sort({ createdAt: -1 })
    .exec();
  const allProfiles = await profile.countDocuments();
  return { recent: recentProfiles, all: allProfiles };
};

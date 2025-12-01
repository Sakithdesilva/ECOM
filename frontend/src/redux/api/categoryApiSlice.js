import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: CATEGORY_URL,
        method: 'POST',
        body:newCategory
      }),
      invalidatesTags: ["Category"]
    }),

      updateCategory: builder.mutation({
        query: ({categoryId,updateCategory}) => ({
          url: `${CATEGORY_URL}/${categoryId}`,
          method:'PUT',
          body: updateCategory
        }),
        invalidatesTags: ["Category"]
      }),

      deleteCategory: builder.mutation({
        query: (categoryId) => ({
          url: `${CATEGORY_URL}/${categoryId}`,
          method:'DELETE'
        }),
        invalidatesTags: ["Category"]
      }),

      fetchAllCategories: builder.query({
        query: () => `${CATEGORY_URL}/categories`,
        providesTags: ["Category"]
      })
       

    
  })
})

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchAllCategoriesQuery

  
} = categoryApiSlice;

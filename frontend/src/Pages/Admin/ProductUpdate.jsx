import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,

} from "../../redux/api/productApiSlice";
import {
  useFetchAllCategoriesQuery
} from "../../redux/api/categoryApiSlice";
import { toast } from 'react-toastify';
import AdminMenu from './AdminMenu';
import { useFetchCategoriesQuery } from '../../../../../Huxn/THE-BIGGEST-REACT-COURSE-ON-THE-INTERNET-main/11. Redux Toolkit/3. MERN E-Commerce Store/frontend/src/redux/api/categoryApiSlice';



const ProductUpdate = () => {
  
  const params = useParams();
  const {data: productData} = useGetProductByIdQuery(params.id);

  const [image,setImage] = useState(productData?.image || "");
  const [name,setName] = useState(productData?.name || "");
  const [description,setDescription] = useState(productData?.description || '');
  const [price,setPrice] = useState(productData?.price || 0);
  const [category,setCategory] = useState(productData?.category || '');
  const [brand,setBrand] = useState(productData?.brand || '');
  const [stock,setStock] = useState(productData?.countInStock || '');
  const [quantity,setQuantity] = useState(productData?.quantity || 0);
   
  

   

  const {data: categories = [] } = useFetchAllCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const navigate = useNavigate();

  const uploadFileHandler = async(e) => {
    const formData = new FormData();
    const selectedFile = e.target.files[0];

    formData.append('image',selectedFile);
     


    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success('Image Added Successfully');
      setImage(res.image);


    } catch (error) {
      toast.error('Image was unable to add');
      console.error(error.error);
    }
  } 

  const handleUpdate = async (e) => {
      e.preventDefault();

       
      try {
        const formData = new FormData();

        

        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("brand", brand);
        formData.append("countInStock", stock);
        formData.append("image",image);

  
        const result = await updateProduct({productId: params.id, formData: formData}).unwrap();
         

        if(result.error){
          toast.error(result.error);
        }else{
          toast.success(`${result.name} Updated Successfully`);
          navigate('/admin/allproducts');
        }
      
      }catch (error) {

        console.error(error);
        toast.error("Product update failed. Try Again.");

      }
    };


    const handleDelete = async() => {
      try {
        let ans = window.confirm('Are You Sure you want to delete this product ?');

        if(!ans) return;

        const {data} = await deleteProduct(params.id);
        toast.success(`${data.name} is deleted`);
        navigate('/admin/allproducts')

      } catch (error) {
        console.log(error);
        toast.error('Delete Failed.Try Again');

      }
    }
  useEffect(() => {
      if(productData && productData._id){
        setName(productData.name);
        setDescription(productData.description);
        setPrice(productData.price);
        setCategory(productData.category);
        setQuantity(productData.quantity);
        setBrand(productData.brand);
        setImage(productData.image);
        setStock(productData.countInStock);

         

      }
  },[productData])




  return (
   <div className="container xl:mx-[9rem] sm:mx-0 ">
      <div className="flex flex-col md:flex-row">
        <AdminMenu/>

        <div className="w-3/4 p-3">
          <div className="h-12">Create Product</div>
          {image && (
            <div className="text-center">
              <img src={image} alt="product"  className="block mx-auto max-h-[200px]"/>

            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer py-11 font-bold">
               {image ? image.name : "Upload Image"}
              <input 
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className={!image ? 'hidden' : 'text-white'}
               />
              
            </label>

          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">
                  Name
                </label><br/>
                <input 
                type="text"
                className="p-2 mb-3 w-[30rem] border rounded-lg bg-[#101011]"
                value={name} 
                onChange={e => setName(e.target.value)}/>
              </div>
              <div className="two ml-5">
                <label htmlFor="name">
                  Price
                </label><br/>
                <input 
                type="number"
                className="p-2 mb-3 w-[30rem] border rounded-lg bg-[#101011]"
                value={price} 
                onChange={e => setPrice(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">
                  Quantity
                </label><br/>
                <input 
                type="number"
                className="p-2 mb-3 w-[30rem] border rounded-lg bg-[#101011]"
                value={quantity} 
                onChange={e => setQuantity(e.target.value)}/>
              </div>
              <div className="two ml-5">
                <label htmlFor="name block">
                  Brand
                </label><br/>
                <input 
                type="text"
                className="p-2 mb-3 w-[30rem] border rounded-lg bg-[#101011]"
                value={brand} 
                onChange={e => setBrand(e.target.value)}/>
              </div>
            </div>
            <label htmlFor="">Description</label>
            <textarea 
              type="text"
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              value={description}
              onChange={e => setDescription(e.target.value)}

            ></textarea>

            <div className="flex justify-between">
              <div>
                <label htmlFor="name block">
                  Count In Stock
                </label><br/>
                <input type="text" className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white" 
                value={stock}
                onChange={e => setStock(e.target.value)}
                />

              </div>
              <div>
                <label htmlFor="">Category</label><br/>
                <select 
                placeholder="Choose Category"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white" 
                value={useFetchCategoriesQuery}
                onChange={e => setCategory(e.target.value)}>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="">
                     <button 
            onClick={handleUpdate} 
            className="py-4 px-10 mt-5 rounded-lg cursor-pointer text-lg font-bold bg-green-600">
                Update
            </button>
             <button 
           onClick={handleDelete} 
            className="py-4 px-10 mt-5 rounded-lg ml-10 cursor-pointer text-lg font-bold bg-pink-600">
                Delete
            </button>

            </div>
           

          </div>
        </div>


      </div>
    </div>
  )
}

export default ProductUpdate
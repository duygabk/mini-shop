import React, { useState, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import axios from "axios";
import Progress from "./Progress";

const ADD_PRODUCT_URL = "http://localhost:8888/api/product/add-product";

const UPLOAD_CKEDITOR_URL = "http://localhost:8888/api/product/testupload";

const REMOVE_IMAGE_URL = "http://localhost:8888/api/product/delete-image";

function getFileName(fileUrl) {
  if (!fileUrl.length) return "";
  const arr = fileUrl.split("");
  const fileName = arr.slice(arr.lastIndexOf("/") + 1).join("");
  return fileName;
}

function ImageThumb(props) {
  const { url, delete: deleteImageByUrl } = props;
  return (
    <div className="card float-left" style={{ maxWidth: 180 }}>
      <img
        className="card-img-top"
        src={url}
        alt="thumb"
        style={{ width: "100%" }}
      />
      <div className="card-img-overlay pt-1 float-right">
        <p
          className="btn btn-danger text-right"
          onClick={() => deleteImageByUrl(url)}
        >
          x
        </p>
      </div>
    </div>
  );
}

function UploadProgress(props) {
  return (
    <div
      className="bg-secondary p-2 rounded"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "100%",
        maxWidth: 400,
        maxHeight: 400,
        padding: 1
      }}
    >
      <Progress percent={props.percent} />
    </div>
  );
}

function ProductForm(props) {
  const [productInfo, setProductInfo] = useState({
    productName: "",
    productCategory: 1,
    productCode: "",
    productPrice: "",
    productDescription: "",
    productSpecification: ""
  });

  const [productImage, setProductImage] = useState([]);

  const [ckeditorImage, setCkeditorImage] = useState([]);

  const [uploadProcess, setUploadPeocess] = useState(0);

  useEffect(() => {
    console.log("Product Form Loaded");
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    const form = document.getElementsByClassName("needs-validation")[0];
    form.classList.add("was-validated");
    // console.log("submit ", form[0]);
    // creat Form Data to post to server
    // const postData = new FormData();
    // if (productImage.length) {
    //   for (let i = 0; i < productImage.length; i++) {
    //     postData.append("productimage", productImage[i], productImage[i].name);
    //   }
    // }
    // postData.append("productpara", productInfo);
    // Test post to server
    let productInfoToPost = { ...productInfo };
    productInfoToPost.productImage = productImage;
    axios({
      method: "POST",
      url: ADD_PRODUCT_URL,
      data: { productInfo: productInfoToPost },
      onUploadProgress: progress => {
        const { loaded, total } = progress;
        const percent = Math.floor((loaded / total) * 100);
        setUploadPeocess(percent);
        // console.log(`${loaded}/${total}`);
      }
    })
      .then(res => {
        console.log(res.data);
        setUploadPeocess(0);
      })
      .catch(err => console.log(err.message));
  };

  const deleteImage = url => {
    // delete image from server by image url
    console.log("delete image: ", url);
    if (!url.length) return;

    axios({
      method: "DELETE",
      url: REMOVE_IMAGE_URL,
      data: { filename: getFileName(url) }
    })
      .then(res => {
        console.log("delete ok ? : ", res.data);
        // response from server OK
        if (!res.data.error) {
          // update state after remove
          const afterDelImage = productImage.filter(img => img !== url);
          setProductImage(afterDelImage);
        }
      })
      .catch(err => {
        console.log("delete failed: ", err.message);
      });
  };

  const handleOnChangeImage = event => {
    const { files } = event.target;
    // update image to server and receive image link
    if (!files.length) return;

    const IMAGE_URL = "http://localhost:8888/api/product/upload-image";

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("productimage", files[i], files[i].name);
    }

    axios({
      method: "POST",
      url: IMAGE_URL,
      data: formData,
      onUploadProgress: function(progress) {
        const { loaded, total } = progress;
        console.log({ loaded, total });
      }
    })
      .then(res => {
        console.log("res ", res.data);
        setProductImage(image => [...image, ...res.data.url]);
      })
      .catch(err => console.log("err ", err.message));

    // let productImageBuff = [...productImage, ...files];
    // array of image files
    // setProductImage(productImageBuff);
  };

  const handleOnchange = event => {
    const { name, value } = event.target;
    let productInfoBuff = { ...productInfo };
    // console.log(name, value);
    productInfoBuff[name] = value;
    setProductInfo(productInfoBuff);
  };

  const handleCKEditorChange = (event, editor) => {
    const data = editor.getData();
    // console.log(data);
    const images = document.getElementsByTagName("img");
    if (images.length) {
      const imageUrls = [];
      // images is an object, therefore, can not using map, filter...
      for (let i = 0; i < images.length; i++) {
        imageUrls.push(images[i].getAttribute("src"));
      }
      // console.log(imageUrls);
      const ckeditorNewImage = imageUrls.filter(
        img => productImage.indexOf(img) === -1
      );
      console.log(ckeditorNewImage);
      // get need remove image list
      const removeImage = ckeditorImage.filter(
        img => ckeditorNewImage.indexOf(img) === -1
      );
      console.log("remove item: ", { removeImage });
      if (removeImage.length) {
        axios({
          method: "DELETE",
          url: REMOVE_IMAGE_URL,
          data: { filename: getFileName(removeImage[0]) }
        })
          .then(res => {
            console.log(res.data);
            setCkeditorImage(ckeditorNewImage);
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    }
    // remove image id it is deleted

    let productInfoBuff = { ...productInfo };
    productInfoBuff.productSpecification = data;
    setProductInfo(productInfoBuff);
  };

  // console.log(productInfo);
  // console.log(productImage);

  return (
    <div
      className="border rounded border-success p-3"
      style={{ position: "relative" }}
    >
      <form
        // action={UPLOAD_URL}
        method="post"
        className="needs-validation"
        encType="multipart/form-data"
        noValidate
        onSubmit={handleSubmit}
      >
        {/* product name */}
        <div className="form-group">
          <label htmlFor="productname">Product Name:</label>
          <input
            className="form-control"
            id="productname"
            type="text"
            name="productName"
            value={productInfo.productName}
            onChange={handleOnchange}
            required
          />
          {/* <div className="valid-feedback">Valided</div> */}
          <div className="invalid-feedback">InValid</div>
        </div>
        {/* product category */}
        <div className="form-group">
          <label htmlFor="">Product Category:</label>
          <select
            className="form-control custom-select"
            name="productCategory"
            // defaultValue={1}
            value={productInfo.productCategory}
            onChange={handleOnchange}
          >
            <option value={1}>Common</option>
            <option value={2}>Category 1</option>
            <option value={3}>Category 2</option>
            <option value={4}>Category 3</option>
          </select>
        </div>
        {/* product code and price */}
        <div className="form-group">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="">Product Code:</label>
              <input
                type="text"
                className="form-control"
                name="productCode"
                onChange={handleOnchange}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="">Product Price:</label>
              <input
                type="text"
                className="form-control"
                name="productPrice"
                onChange={handleOnchange}
              />
            </div>
          </div>
        </div>
        {/* product description */}
        <div className="form-group">
          <label htmlFor="">Product Description:</label>
          <textarea
            className="form-control"
            name="productDescription"
            rows="3"
            onChange={handleOnchange}
          />
        </div>
        {/* product images */}
        <div className="form-group">
          <label htmlFor="">Image:</label>
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              name="productImage"
              id="customFile"
              onChange={handleOnChangeImage}
              multiple
            />
            <label className="custom-file-label" htmlFor="customFile">
              Choose file
            </label>
          </div>

          <div className="bg-dark text-white p-1  card-columns">
            {/* {previewImage} */}
            {productImage.length
              ? productImage.map((imageUrl, key) => (
                  <ImageThumb key={key} url={imageUrl} delete={deleteImage} />
                ))
              : null}
          </div>
        </div>
        {/* product specification */}
        <div className="form-group">
          <label htmlFor="">Product Specification:</label>
          <CKEditor
            data={productInfo.productSpecification}
            editor={ClassicEditor}
            config={{
              ckfinder: {
                uploadUrl: UPLOAD_CKEDITOR_URL
              }
            }}
            onChange={handleCKEditorChange}
          />
        </div>
        {/* summit - reset */}
        <hr />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Submit
          </button>{" "}
          {`   `}
          <button type="reset" className="btn btn-danger">
            Reset
          </button>
        </div>
      </form>
      <UploadProgress percent={uploadProcess} />
    </div>
  );
}

export default ProductForm;

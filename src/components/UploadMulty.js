import React, { useState } from "react";

const ADD_PRODUCT_URL = "http://localhost:8888/api/product/add-product";

import axios from "axios";

export default function UploadMulty() {
  const [files, setFiles] = useState("");

  const handleOnChangeFile = event => {
    const files = event.target.files;
    // console.log(files.length, typeof [...files]);
    setFiles(files);
  };

  const uploadAxios = () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("productimage", files[i]);
    }
    // return;
    axios({
      method: "POST",
      url: ADD_PRODUCT_URL,
      data: formData
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err.message));
  };

  return (
    <form action={ADD_PRODUCT_URL} method="POST" encType="multipart/form-data">
      <input
        type="file"
        multiple
        name="productimage"
        onChange={handleOnChangeFile}
      />
      <button type="reset">Reset</button>
      <button type="button" onClick={uploadAxios}>
        Upload Axios
      </button>
    </form>
  );
}

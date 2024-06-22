import React, { useEffect, useState } from "react";

const useTestHooks = () => {
  const [list, setList] = useState<any>();

  useEffect(() => {
    const getList = async () => {
      try {
        // const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        fetch("https://jsonplaceholder.typicode.com/posts")
          .then((response) => response.json())
          .then((json) =>{
            setList(json)
            console.log(json)
          } );
        // console.log("list123 ====>", res.body);
        // const result = res;
        // setList(result);
      } catch (error) {
        console.log("error", error);
      }
    };

    getList();
  }, []);

  return { list };
};

export default useTestHooks;

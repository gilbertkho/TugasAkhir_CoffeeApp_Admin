import jwt from 'jsonwebtoken';
import localforage from 'localforage';

const auth = async () => {
  let data = {
    status: false,
    msg: '',
    data: {}
  };
  console.log('OK');
  // const cekCookie = document.cookie.split(';');
  // console.log(cekCookie)
  let getCookie = '';
  // for(let i = 0; i < cekCookie.length; i++){
  //   let getCookieName = cekCookie[i].split("=");
  //   if(getCookieName[0].includes("admin")){
  //     getCookie = getCookieName[1];
  //   }
  // }
  try {
    getCookie = await localforage.getItem('APIKEY');
  } catch (error) {
    console.log(error);
  }

  jwt.verify(getCookie, 'admin', (err, decoded) => {
    if (err) {
      data.msg = 'Token expired.';
    } else {
      data.status = true;
      data.msg = 'OK';
      data.data = JSON.parse(decoded.data);
      console.log(data);
    }
  });
  return data;
}

export default auth;

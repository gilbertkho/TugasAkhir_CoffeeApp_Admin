/* eslint-disable */
import React, { Fragment, useState, useEffect } from 'react';
import { ValidateEmail } from 'utils/validation';
import {
  Card, CardTitle, Form, FormGroup, Label, Input,
  FormFeedback, Col, Row, Button, CustomInput, InputGroup,
  InputGroupAddon, InputGroupText
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, Zoom } from 'react-toastify';
import axios from 'config/axios';
import Errormsg from "config/errormsg";
import moment from 'moment';
import { useHistory } from 'react-router';
import urlConfig from "config/backend";
import localforage from 'config/localForage';
import { connect } from 'react-redux';
import { setProfilePicture } from '../../redux/reducers/General';
import LaddaButton from 'react-ladda/dist/LaddaButton';
import { encode, decode } from 'node-encoder';

function Profile(props) {
  // console.log("props", props);
  const history = useHistory();
  const [user, setUser] = useState({ 
    id_gerai: "", 
    nama: "", 
    password: "", 
    email: "", 
    alamat: "", 
    no_telp: "", 
    status_gerai: "", 
    nama_pemilik: "",    
    foto_gerai: "",
    foto_profil: null });
  const [showPassword, setShowPassword] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [submitDisable, setSubmitDisable] = useState(false);

  const changeUser = (field, value) => { setUser({ ...user, [field]: value }); };
  const resetUser = () => { setUser({
      id_gerai: "", 
      nama: "", 
      password: "", 
      email: "", 
      alamat: "", 
      no_telp: "", 
      status_gerai: "", 
      nama_pemilik: "", 
      foto_gerai: "",
      foto_profil: null })
    };
  const changeShowPasswordState = () => { setShowPassword(!showPassword) };
  const changeSubmitDisableState = (value) => { setSubmitDisable(value) };

  const setBirthDate = (value) => { setUser({ ...user, birthdate: value }); };

  let $imagePreview = null;
  if (imagePreviewUrl) {
    $imagePreview = (<img src={imagePreviewUrl} style={{ width: '100%' }} />);
  } 
  // else {
  //   $imagePreview = (<div className="previewText">Silahkan pilih gambar</div>);
  // }
 
  function _handleImageChange(e) {
    if(e.target.files){
      e.preventDefault();
  
      let reader = new FileReader();
      let file = e.target.files[0];
  
      reader.onloadend = () => {
        setUser({ ...user, foto_profil: file });
        setImagePreviewUrl(reader.result);
      }
  
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    _getProfile();
  }, []);
  
  useEffect(() => { console.log(user) }, [user]);

  async function setHeaderPP() {
    toast.dismiss();
    try {
      let res = await axios.get('/b/o/master/users/auth');
      if (res.status === 200) {
        let data = await res.data;
        let user = data.data;
        let storedUser = await localforage.getItem('user');
        if (storedUser) {
          storedUser.pict = user.profilepicture;
          await localforage.setItem('user', storedUser);
        }
        props.setProfilePicture(user.profilepicture);
      }
    } catch (error) {
      // if (!error.response) {
      //   toast.error(error.toString(), { containerId: 'B', transition: Zoom });
      //   return
      // }
      toast.error(Errormsg['500'], { containerId: 'B', transition: Zoom });
    }
  }

  const _getProfile = async () => {
    changeSubmitDisableState(true);
    axios.get("/app/gerai/profile").then(({ data }) => {
      if (data.status) {
        // console.log("user profile", data);
        let userGet = data.data;
        setUser({
          id_gerai: userGet.id_gerai,
          nama: userGet.nama,
          password: decode(userGet.password),
          email: userGet.email,
          alamat: userGet.alamat,
          no_telp: userGet.no_telp,                    
          nama_pemilik: userGet.nama_pemilik,
          status_gerai: userGet.status_gerai,
          foto_gerai: userGet.foto_gerai,
          foto_profil: null
        });
        if (userGet.foto_gerai != '') {          
          setImagePreviewUrl(urlConfig.urlBackend + "app/gerai/gerai_photo" );
        }
      } else {
        // console.log("error");
        toast.error(data.msg, { containerId: 'B', transition: Zoom });
      }
      changeSubmitDisableState(false);      
      // console.log(res);
    }).catch(error => {
      console.log(error)
      console.log(error.response)
      if(error.response.status != 500){
        toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
      }
      else{
        toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
      }
      // setSubmited(false);
      changeSubmitDisableState(false);
    })
  };

  const _onSubmit = () => {
    toast.dismiss();
    let formData = new FormData;
    // Object.entries(user).map(([key, value]) => {
    //   if (value != undefined) {
    //     switch (key) {
    //       case 'birthdate':
    //         if (value != null) {
    //           formData.append(key, moment(value).format('YYYY-MM-DD'));
    //         } else {
    //           formData.append(key, '');
    //         }
    //         break;
    //       default:
    //         formData.append(key, value)
    //         break;
    //     }
    //   } else {
    //     formData.append(key, '')
    //   }
    // });
    if(!user.nama || !user.email || !user.password || !user.alamat || !user.no_telp ||!user.nama_pemilik || !user.foto_gerai){
      toast.error("Harap lengkapi semua pengisian", {containerId : "B", transition : Zoom})
    }
    else if(!ValidateEmail(reg.email)){
      // setSubmitted(true);
      toast.error("Format email salah", {containerId : "B", transition : Zoom})
    }
    else{
      for(let key in user){
        formData.append(key, user[key])
      }
      changeSubmitDisableState(true);
      axios.post('/app/gerai/profile/update', formData).then(({ data }) => {
        if (data.status) {        
            // setHeaderPP();
            toast.success('Profil berhasil diubah', { containerId: 'B', transition: Zoom });
            // window.location.reload();
            setTimeout(()=>{
              window.location.reload()
            },2000)
            changeSubmitDisableState(false);        
        } else {
          // console.log("error");
          toast.error(data.msg, { containerId: 'B', transition: Zoom });
        }
          // console.log(res);
      }).catch(error => {
        console.log(error)
        console.log(error.response)
        if(error.response.status != 500){
          toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        }
        else{
          toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
        }
        // setSubmited(false);
        changeSubmitDisableState(false);
      })
    }
  };

  return (
    <>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Card body>
            <CardTitle>Profil Gerai</CardTitle>
            <Form>
              <FormGroup>
                <Label for="status">Status Gerai: {user.status_gerai === "NoSubs" ? "Belum Berlangganan" : "Langganan Aktif"}</Label>
              </FormGroup>
              <FormGroup>
                <Label for="fullname">Nama Gerai</Label>
                <Input id="fullname" value={user.nama} required onChange={(e) => changeUser("nama", e.target.value)} />
                <FormFeedback>Nama tidak boleh kosong</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="owner">Nama Pemilik</Label>
                <Input id="owner" type="text" value={user.nama_pemilik} onChange={(e) => changeUser("nama_pemilik", e.target.value)} />
              </FormGroup>  
              <FormGroup>
                <Label for="alamat">Alamat Gerai</Label>
                <Input id="alamat" type="textarea" value={user.alamat} onChange={(e) => changeUser("alamat", e.target.value)} />
                <FormFeedback>Alamat tidak boleh kosong</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="mobile">Nomor Telepon</Label>
                <Input id="mobile" value={user.no_telp} onChange={(e) => changeUser("no_telp", e.target.value)} />
                <FormFeedback>Nomor Telepon tidak boleh kosong</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input id="email" value={user.email} required onChange={(e) => changeUser("email", e.target.value)} />
                <FormFeedback>Email tidak boleh kosong</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="pwd">Password</Label>
                <InputGroup>
                  <Input required id="pwd" placeholder="Password" type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => changeUser("password", e.target.value)} />
                  <InputGroupAddon addonType="prepend">
                    <Button onClick={changeShowPasswordState}>
                      <FontAwesomeIcon icon={['fas', 'eye']} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <FormFeedback>Password tidak boleh kosong</FormFeedback>
              </FormGroup>                          
              <FormGroup>
                <Label htmlFor="photo">Foto Gerai</Label>
                <Input type="file" name="file" id="photo" accept="image/*" style={{ display: "none" }} onChange={(e) => _handleImageChange(e)} />
                <br />
                <Button className="btn-pill font-weight-bold px-4 text-uppercase font-size-sm" outline color="primary" onClick={() => { document.getElementById("photo").click() }}>
                  Pilih Gambar
                </Button>
              </FormGroup>
              <div>
                {(user.profilepicture != null) &&
                  user.profilepicture.name
                }
              </div>
              <div style={{ marginBottom: 20 }}>
                {$imagePreview}
              </div>
              {/* <FormGroup>
                <Label for="gender">Jenis Kelamin</Label>
                <div>
                  <CustomInput type="radio" id="genderMale" name="gender" label="Laki-laki" value="Male" checked={user.gender == 'Male'} onChange={(e) => { changeUser("gender", e.target.value); }} />
                  <CustomInput type="radio" id="genderFemale" name="gender" label="Perempuan" value="Female" checked={user.gender == 'Female'} onChange={(e) => { changeUser("gender", e.target.value); }} />
                </div>
                <FormFeedback>Jenis kelamin harus dipilih</FormFeedback>
              </FormGroup> */}
              <LaddaButton
                className="btn btn-primary btn-block "
                loading={submitDisable} onClick={_onSubmit}>
                Submit
              </LaddaButton>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

// const mapStateToProps = (state) => ({
//   rProfilePicture: state.General.profilePicture
// });

// const mapDispatchToProps = (dispatch) => ({
//   setProfilePicture: (pp) => dispatch(setProfilePicture(pp))
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export default Profile;

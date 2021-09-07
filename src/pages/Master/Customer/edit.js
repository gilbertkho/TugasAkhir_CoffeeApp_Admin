/* eslint-disable */
import React, { Fragment, useState, useEffect } from 'react';
import {
  Card, CardTitle, Form, FormGroup, Label, Input,
  FormFeedback, Col, Row, Button, CustomInput, InputGroup,
  InputGroupAddon, InputGroupText, FormText, Breadcrumb, BreadcrumbItem,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, Zoom } from 'react-toastify';
import axios from 'config/axios';
import Errormsg from "config/errormsg";
import moment from 'moment';
import { useHistory } from 'react-router';
import urlConfig from "config/backend";
import Select, { Option } from 'rc-select';
import LaddaButton from 'react-ladda/dist/LaddaButton';
import getApiKey from 'config/getApiKey';

export default function AdminReqEditForm(props) {
  // const admin = props.location.state.admin;
  const [apikey, setApikey] = useState('');
  const history = useHistory();
  const [req, setReq] = useState({ 
    id_customer: "",
    nama: "",
    alamat: "",
    no_telp: "",    
    email: "",    
    status_customer: "",
    verified: "",
    apikey: apikey,
  });

  const [actionType, setActionType] = useState("add");
  const [submited, setSubmited] = useState(false);
  const changeReq = (field, value) => { setReq({ ...req, [field]: value });};
  useEffect(()=>{
    console.log(req);
  },[req]);
  const resetReq = () => { setReq({ 
    id_customer: "",
    nama: "",
    alamat: "",
    no_telp: "",    
    email: "",    
    status_customer: "",
    verified: "",
    apikey: apikey,
    })
  };

  const [reqMajor, setReqMajor] = useState({id:"",  setupid:"", major:"", countquestion:0, setupquestion:[]});
  const [submitDisable, setSubmitDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const changeSubmitDisableState = (value) => { setSubmitDisable(value) };

  const resetForm = () => {
    resetReq();
    setActionType("add");
  }

  useEffect(() => {
    resetForm();
    if (props.location.state && props.location.state.user) {
      console.log(props.location.state)
      let propsReq = props.location.state.user;
      getApiKey().then((key) => {
        if(key.status){
          setApikey(key.key);
          setReq({
            ...req,
            id_customer: propsReq.id_customer,
            nama: propsReq.nama,
            alamat: propsReq.alamat,
            no_telp: propsReq.no_telp,            
            email: propsReq.email,            
            status_customer: propsReq.status_customer,
            verified: propsReq.verified,
            apikey: key.key
          });
        }
      })
      setActionType("edit");
    }
    else{
      window.location.href="/404";
    }
  }, []);
  
  useEffect(() => {
    console.log(reqMajor)
  },[reqMajor])
  
  useEffect(() => {
    console.table(category)
  },[category])

  useEffect(() => {
    console.log(req); 
    if(actionType === "edit"){                    
      // getMajorSetup();
    }
  },[req])

  const _onSubmit = (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!req.id_customer || !req.nama || !req.alamat || !req.no_telp || !req.email || !req.status_customer || !req.verified) {
      setSubmited(true);
      toast.error('Harap lengkapi pengisian', { containerId: 'B', transition: Zoom });
    }
    else {
      changeSubmitDisableState(true);
      let url = '/app/admin/customer/update';
      let successMsg = 'Data customer berhasil diubah';
      axios.post(url, req).then(({ data }) => {
        if (data.status) {
          toast.success(successMsg, { containerId: 'B', transition: Zoom });
          if (actionType == 'add') {
            setReq({...req, id_customer:data.data});
            setActionType('edit');
          } else {
            //return to list after timeout
            setTimeout(
              history.push('/master/customer')
              , 5000);
          }
        } else {          
          toast.error(data.msg, { containerId: 'B', transition: Zoom });
        }
        changeSubmitDisableState(false);
        setSubmited(false);        
      }).catch((error) => {        
        console.log(error.response)
        if(error.response.status != 500){
          toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        }        
        else{
          toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
        }
        setSubmited(false);
        changeSubmitDisableState(false);
      })
    }
  };

  return (
    <>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Card body>
            <Breadcrumb>
              <BreadcrumbItem><a href="/#" onClick={(e) => { e.preventDefault(); history.push('/master/customer') }}>Customer</a></BreadcrumbItem>
              <BreadcrumbItem active>{actionType == "add" ? "Tambah" : "Edit"} Customer</BreadcrumbItem>
            </Breadcrumb>
            <CardTitle>{actionType == "add" ? "Tambah Customer" : "Edit Customer"}</CardTitle>
            <Form>                          
            <FormGroup>
                <Label for="fullname">Nama Customer</Label>
                <Input id="fullname" value={req.nama} required onChange={(e) => changeReq("nama", e.target.value)} />
                <FormFeedback>Nama tidak boleh kosong</FormFeedback>
              </FormGroup>              
              <FormGroup>
                <Label for="alamat">Alamat Customer</Label>
                <Input id="alamat" type="textarea" value={req.alamat} onChange={(e) => changeReq("alamat", e.target.value)} />
                <FormFeedback>Alamat tidak boleh kosong</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="mobile">Nomor Telepon</Label>
                <Input id="mobile" value={req.no_telp} onChange={(e) => changeReq("no_telp", e.target.value)} />
                <FormFeedback>Nomor Telepon tidak boleh kosong</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input id="email" value={req.email} required onChange={(e) => changeReq("email", e.target.value)} />
                <FormFeedback>Email tidak boleh kosong</FormFeedback>
              </FormGroup>              
              <FormGroup>
                <Label for = "custstatus" className = "ml-4">
                  <Input id = "custstatus" type = "checkbox" checked = {req.status_customer === "AKTIF" ? true : false} onChange = {() => {changeReq("status_customer", req.status_customer === "AKTIF" ? "NONAKTIF" : "AKTIF");}}
                  />
                  Status Aktif Customer
                </Label>                
              </FormGroup>
              <FormGroup>
                <Label for = "verifikasicust" className = "ml-4">
                  <Input id = "verifikasicust" type = "checkbox" checked = {req.verified === "FALSE" ? false : true} onChange = {() => {changeReq("verified", req.verified === "TRUE" ? "FALSE" : "TRUE");}}
                  // disabled = {major.length <=0 || major.find((mq) => mq.setupquestion.length <= 0 || !mq.setupquestion) ? true : false}
                  />
                  Status Verifikasi Customer
                </Label>
                <FormText color="primary">Centang jika data customer sudah terverifikasi.</FormText>
              </FormGroup>
              <hr />    
              <LaddaButton className="btn btn-primary"
                style = {{ width: "100%", marginTop: "1rem" }}
                loading = {submitDisable} onClick = {_onSubmit}>
                Submit
              </LaddaButton>
              {/* <hr />
              <LaddaButton className = "btn btn-danger"
                style = {{ width: "100%"}}
                loading = {submitDisable} onClick = {resetForm}>
                Reset
              </LaddaButton> */}
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

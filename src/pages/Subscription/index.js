/* eslint-disable */
import React, { Fragment, useState, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import {
  Card, CardTitle, CardBody, Button, Modal, ModalHeader,
  ModalBody, ModalFooter, Row, Col, Label, Input, Table
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from "config/axios";
import moment from "moment";
import urlConfig from "config/backend";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, Zoom } from 'react-toastify';
import Errormsg from 'config/errormsg';
import getApiKey from 'config/getApiKey';

export default function ListPendaftar() {

  const history = useHistory();
  const [users, setUsers] = useState([]);
  let [totalSize, setTotal] = useState(0);
  let [page, setPage] = useState(1);
  const sizePerPage = 10;
  const searchRef = useRef();
  const [param, setParam] = useState({
    page: 1,
    count: sizePerPage,
    search: '',
    apikey: '',
  });

  const [toDelete, setToDelete] = useState(false);
  const [selected, setSelected] = useState({});
  const [period, setPeriod] = useState([]);
  const toggleDelete = (user) => {
    setToDelete(!toDelete);
    setSelectedUser(user)
  };

  const toEditUser = (user) => history.push('/subscription/edit', { user: user });

  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const toggle = () => { setModal(!modal) };
  const toggleEdit = (user) => { setModal(!modal); setSelectedUser(user) };
  const refreshRow = (user) => {
    axios.post('/payment/notification',{order_id: user.id_subscription, apikey: param.apikey}).then(({data}) => {      
      if(data.status){
        fetchData(param)
      }
      else{
        toast.error(data.msg, {containerId:"B", transition:Zoom})
      }
    }).catch(error => {
      toast.error(Errormsg['500'], {containerId:"B", transition:Zoom})
    })
  }
  // useEffect(() => { console.log(totalSize) }, [totalSize]);

  const GetActionFormat = (cell, row) => {
    console.log(row);
    return (
      <div>
        <Button color="primary" className="mr-2" size="sm" onClick={() => { refreshRow(row) }}>
          <FontAwesomeIcon icon={['fa', 'sync']} />
        </Button>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toEditUser(row) }} disabled ={row.status_subscription != 'PAID'? true : false}>
          <FontAwesomeIcon icon={['fa', 'edit']} />
        </Button>
        {/* <Button color="danger" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleDelete(row) }}>
          <FontAwesomeIcon icon={['fa', 'trash-alt']} />
        </Button> */}
      </div>
    );
  }
  
  const getPhotoFormat = (cell,row) =>{    
    return (
      <img height="150" width="150" src={urlConfig.urlBackend + "app/gerai/menu_photo/" + row.id_menu }/>
    )
  }

  const timeEndFormat = (cell,row) =>{
    let date = new Date(row.time_end);    
    if(row.time_end){
      return(
        <>
          {date.getDate()+ " " + date.toLocaleDateString('default',{month:'long'}) +" "+ date.getFullYear()}
        </>
      )
    }
    else{
      return (
        <p className="text-warning">Tanggal berakhir belum ditambahkan</p>
      )
    }
  }

  const timeStartFormat = (cell,row) =>{
    let date = new Date(row.time_start);  
    if(row.time_start){
      return(
        <>
          {date.getDate()+ " " + date.toLocaleDateString('default',{month:'long'}) +" "+ date.getFullYear()}
        </>
      )
    }  
    else{
      return (
        <p className="text-warning">Tanggal berlaku belum ditambahkan</p>
      )
    }
  }

  const statusFormat = (cell,row) =>{
    if(row.status_subscription === 'PAID')
    return(
      <strong className = "text-success">{row.status_subscription}</strong>
    )
    else if(row.status_subscription === 'PENDING')
    return(
      <strong className = "text-warning">{row.status_subscription}</strong>
    )
    else if(row.status_subscription === 'DENY' || row.status_subscription === 'FAILED' || row.status_subscription === 'OFF' )
    return(
      <strong className = "text-danger">{row.status_subscription}</strong>
    )
    
  }

  const columns = [{
    dataField: 'action',
    text: 'Action',
    formatter: GetActionFormat,
    headerStyle: (column, colIndex) => {
      return { width: '150px' };
    }
  }, {
    dataField: 'nama',
    text: 'Nama Gerai'
  },{
    dataField: 'time_start',
    text: 'Tanggal Berlaku',
    formatter: timeStartFormat
  },{
    dataField: 'time_end',
    text: 'Tanggal Berakhir',
    formatter: timeEndFormat
  },{
    dataField: 'status_subscription',
    text: 'Status Langganan',
    formatter: statusFormat
  }];

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectAll: true,
    selectColumnStyle: { width: 40 },
    onSelect: (row, isSelect, rowIndex, e) => {
      // console.log(row.id);
      // console.log(isSelect);
      // console.log(rowIndex);
      // console.log(e);
    },
  };

  function fetchData(param) { 
    console.log(param)
    axios.post('/app/admin/gerai/subscription', param).then(({data}) => {
      if (data.status) {
          console.log(data)
          setTotal(parseInt(data.total))
          setUsers(data.data)          
        } else {
          toast.error(data.msg, { containerId: 'B', transition: Zoom });
        }
      }).catch(error => {
        if(error.response.status != 500){
          toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        }        
        else{
          toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
        }        
      })
  }

  function getDetailRegister(id) {
    toast.dismiss();
    axios.post('/b/o/master/registered/period', JSON.stringify({ id: id })).then(res => res.data)
      .then(data => {
        // console.log("period", data);
        setPeriod(data.data);
      }).catch(error => {
        // if (!error.response) {
        //   alert(error)
        //   return
        // }
        toast.error(Errormsg['500'], { containerId: 'B', transition: Zoom });
      })
  }

  useEffect(() => {
    getApiKey().then((key) => {
      if(key.status){
        setParam({...param, apikey: key.key});
      }
    })
  },[])

  useEffect(() => {
    if(param.apikey !== ''){
      fetchData(param)
    }
  }, [param]);

  const handleTableChange = (type, { page, sizePerPage }) => {
    setParam((prevState) => ({
      ...prevState,
      page: page
    }))
  }

  const deleteHandler = async () => {
    toast.dismiss();
    axios.post('app/admin/gerai/delete', {id_tipe: selectedUser.id_tipe}).then(({data}) => {
        if (data.status) {
          // if (page == 1) {
          //   fetchData(1, sizePerPage);
          // } else {
          //   setPage(1);
          // }
          toast.success(data.msg, {containerId:"B", transition:Zoom});
          fetchData(param);
          toggleDelete({});
        }
        else{
          toast.error(data.msg, {containerId:"B", transition:Zoom});
        }
      })
    .catch(error => { 
      if(error.response.status != 500){
        toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
      }        
      else{
        toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
      }      
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setParam((prevState) => ({ ...prevState, page: 1, search: searchRef.current.value }))
  }

  return (
    <>
      <Modal zIndex={2000} centered isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Detail Gerai</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={4}>Nama Gerai</Col>
            <Col xs={8}>{": " + selectedUser.nama}</Col>
          </Row>
          <Row>
            <Col xs={4}>Alamat</Col>
            <Col xs={8}>{": " + selectedUser.alamat}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nomor Telepon</Col>
            <Col xs={8}>: {selectedUser.no_telp}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nama Pemilik</Col>
            <Col xs={8}>{": " + selectedUser.nama_pemilik}</Col>
          </Row>
          <Row>
            <Col xs={4}>Email</Col>
            <Col xs={8}>{": " + selectedUser.email}</Col>
          </Row> 
          <Row>
            <Col xs={4}>Saldo</Col>
            <Col xs={8}>{": " + selectedUser.saldo_gerai}</Col>
          </Row>         
          <Row>
            <Col xs={4}>Status</Col>
            <Col xs={8}>{": " + selectedUser.status_gerai}</Col>
          </Row>          
          {/* {(period.length > 0) &&
            <div className="table-responsive-md">
              <Table className="text-nowrap mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>Tahun</th>
                    <th>Gelombang</th>
                  </tr>
                </thead>
                <tbody>
                  {(period.map((pdetail) => {
                    return <tr>
                      <td>
                        <div className="align-box-row">
                          {pdetail.yearperiod}
                        </div>
                      </td>
                      <td>
                        {pdetail.wavenum}
                      </td>
                    </tr>
                  }))}
                </tbody>
              </Table>
            </div>
          } */}
          <hr />
          <Row>
            <Col xs={4}>Foto / Logo Gerai</Col>
            <Col xs={8}>
              {selectedUser.profilepicture != '' &&
                <img style={{ maxWidth: 200, maxHeight: 200 }} src={urlConfig.urlBackend + "app/admin/gerai_photo/" + selectedUser.foto_gerai} />
              }
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
          <Button color="secondary" onClick={toggle}>Tutup</Button>
        </ModalFooter>
      </Modal>
      <Modal zIndex={2000} centered isOpen={toDelete} toggle={toggleDelete}>
        <ModalHeader toggle={toggleDelete}>Apakah anda yakin untuk menghapus tipe menu ini?</ModalHeader>
        {/* <ModalBody>
          <Row>
            <Col xs={4}>Nama</Col>
            <Col xs={8}>{": " + selectedUser.fullname}</Col>
          </Row>
          <Row>
            <Col xs={4}>Email</Col>
            <Col xs={8}>{": " + selectedUser.email}</Col>
          </Row>
          <Row>
            <Col xs={4}>Jenis Kelamin</Col>
            <Col xs={8}>: {selectedUser.gender == 'Male' ? 'Laki-laki' : 'Perempuan'}</Col>
          </Row>
          <Row>
            <Col xs={4}>No HP</Col>
            <Col xs={8}>{": " + selectedUser.mobile}</Col>
          </Row>
          <Row>
            <Col xs={4}>Tempat Lahir</Col>
            <Col xs={8}>{": " + selectedUser.birthplace}</Col>
          </Row>
          <Row>
            <Col xs={4}>Tanggal Lahir</Col>
            {selectedUser.birthdate != '' ?
              <Col xs={8}>{": " + moment(selectedUser.birthdate).format('DD-MM-YYYY')}</Col>
              :
              <Col xs={8}>{": " + selectedUser.birthdate}</Col>
            }
          </Row>
          <hr />
          <Row>
            <Col xs={4}>Alamat</Col>
            <Col xs={8}>{": " + selectedUser.address}</Col>
          </Row>
          <Row>
            <Col xs={4}>Kota</Col>
            <Col xs={8}>{": " + selectedUser.city}</Col>
          </Row>
          <Row>
            <Col xs={4}>Provinsi</Col>
            <Col xs={8}>{": " + selectedUser.province}</Col>
          </Row>
          <hr />
          <Row>
            <Col xs={4}>Sekolah</Col>
            <Col xs={8}>{": " + selectedUser.schoolname}</Col>
          </Row>
          <Row>
            <Col xs={4}>Jurusan</Col>
            <Col xs={8}>{": " + selectedUser.major}</Col>
          </Row>
          {selectedUser.major == 'SMK' &&
            <Row>
              <Col xs={4}>Jurusan SMK</Col>
              <Col xs={8}>{": " + selectedUser.majordetail}</Col>
            </Row>
          }
          <Row>
            <Col xs={4}>Tahun Lulus</Col>
            <Col xs={8}>{": " + selectedUser.graduateyear}</Col>
          </Row>
          <hr />
          <Row>
            <Col xs={4}>Agama</Col>
            <Col xs={8}>{": " + selectedUser.religion}</Col>
          </Row>
          <Row>
            <Col xs={4}>Tanggal Baptis</Col>
            {selectedUser.baptismdate != '' ?
              <Col xs={8}>{": " + moment(selectedUser.baptismdate).format('DD-MM-YYYY')}</Col>
              :
              <Col xs={8}>{": " + selectedUser.baptismdate}</Col>
            }
          </Row>
          <Row>
            <Col xs={4}>Nama Gereja</Col>
            <Col xs={8}>{": " + selectedUser.churchname}</Col>
          </Row>
          <hr />
          <Row>
            <Col xs={4}>Total Mendaftar</Col>
            <Col xs={8}>{": " + selectedUser.regcount}</Col>
          </Row>
          <hr />
          <Row>
            <Col xs={4}>Foto</Col>
            <Col xs={8}>
              {selectedUser.profilepicture != '' &&
                <img style={{ maxWidth: 200, maxHeight: 200 }} src={urlConfig.urlBackendProfile + selectedUser.profilepicture} />
              }
            </Col>
          </Row>
        </ModalBody> */}
        <ModalFooter>
          <Button color="danger" onClick={deleteHandler}>Delete</Button>
          <Button color="secondary" onClick={toggleDelete}>Tutup</Button>
        </ModalFooter>
      </Modal>
      <Card>
        <CardBody>
          <CardTitle>Daftar Langganan</CardTitle>
          {/* <Button color = "primary" onClick = {() => {history.push('gerai/edit')} }>+ Tambah Gerai</Button> */}
          <div className="my-2">
            <Label>Search</Label>
            <Input className="m-0" type="search" placeholder="Nama gerai" innerRef={searchRef} />
            <Button onClick={handleSearch} color="primary" className="mt-2">
              <FontAwesomeIcon icon={['fas', 'search']} />
              <span style={{ marginLeft: 10 }}>
                Cari
              </span>
            </Button>
          </div>
          <BootstrapTable
            remote
            keyField='id_subscription'
            data={users}
            columns={columns}
            // selectRow={selectRow}
            bodyClasses="bootstrap-table"
            pagination={paginationFactory({
              hideSizePerPage: true,
              hidePageListOnlyOnePage: true,
              page: param.page,
              sizePerPage,
              totalSize
            })}
            onTableChange={handleTableChange}
            noDataIndication="Belum ada pendaftar"
            wrapperClasses="table-responsive"
          />
        </CardBody>
      </Card>
    </>
  );
}

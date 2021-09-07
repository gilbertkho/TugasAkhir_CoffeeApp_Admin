/* eslint-disable */
import React, { Fragment, useState, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import {
  Card, CardTitle, CardBody, Button, Modal, ModalHeader,
  ModalBody, ModalFooter, Row, Col, Label, Input, Table, FormText,
  Breadcrumb, BreadcrumbItem
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
import Chart from 'react-apexcharts';

export default function LaporanTask(props) {

  const history = useHistory();
  const [users, setUsers] = useState([]);
  let [totalSize, setTotal] = useState(0);
  let [page, setPage] = useState(1);
  const [apikey, setApikey] = useState('');
  const [timeStart, setTimeStart] = useState('');  
  const [timeEnd, setTimeEnd] = useState('');
  const [chartOptions, setChartOptions] = useState({    
      chart:{
        id: "basic-bar"
      },
      xaxis: {
        categories: []
      },
      noData: {
        text: "Data not found."
      },
      colors:['#07ff60','#ff9500','#9C27B0']
  })
  const [chartSeries, setChartSeries] = useState([
    {
      name: 'COMPLETED',
      data: []
    },{
      name: 'ONGOING',
      data: []
    }
  ])
  const sizePerPage = 10;
  const searchRef = useRef();
  const [param, setParam] = useState({
    page: 1,
    count: sizePerPage,
    search: '',
    id_task: '',
    nama_reward: '',
    nama: '',
    status_task: '',
    kuota_task: '',
    level_task: '',
    time_start: timeStart,
    time_end: timeEnd,
    apikey: apikey
  });

  const [toDelete, setToDelete] = useState(false);
  const [selected, setSelected] = useState({});
  const [period, setPeriod] = useState([]);
  const toggleDelete = (user) => {
    setToDelete(!toDelete);
    setSelectedUser(user)
  };

  const toEditUser = (user) => history.push('/order/edit', { user: user });

  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const toggle = () => { setModal(!modal) };
  const toggleEdit = (user) => { setModal(!modal); setSelectedUser(user) };

  // useEffect(() => { console.log(totalSize) }, [totalSize]);

  const addCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  };  

  function fetchData(param) {
    console.log(param)
    axios.post('/app/admin/report/gerai/detail/task/customer', param).then(({data}) => {
        console.log(data)
        if (data.status) {          
          let series = [...chartSeries];
          let options = {...chartOptions};
          data.data.task.forEach((dt, key) => {
            if(dt.status_completed === 'ONGOING'){
              series[1].data.push(parseInt(dt.count));
            }
            else{
              series[0].data.push(parseInt(dt.count));
            }
            options.xaxis.categories.push(dt.status_completed)
          })
          setChartSeries(series);
          setChartOptions(options);
          setUsers(data.data.customer);
          setTotal(parseInt(data.total));
        } else {
          toast.error(data.msg, { containerId: 'B', transition: Zoom });
        }
      }).catch(error => {
        console.log(error)
        if(error.response.status != 500){
          toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        }
        else{
          toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
        }
      })
  }

  useEffect(() => {
    getApiKey().then((key) => {
      let propsReq = props.location.state.user;
      console.log(propsReq)
      if(key.status){
        setApikey(key.key);
        setParam({
          ...param,
          id_task: propsReq.id_task,
          level_task: propsReq.level_task,
          nama: propsReq.nama,
          time_start: propsReq.time_start,
          time_end: propsReq.time_end,
          status_task: propsReq.status_task,
          kuota_task: propsReq.kuota_task,
          // nama_reward: propsReq.nama_voucher,
          apikey: key.key
        });
      }
    });
  }, [])

  useEffect(() => {    
    if(param.apikey !== ''){
      fetchData(param)
    }
  }, [param]);

  useEffect(() => {
    console.log('INI OPTIONS' , chartOptions)
    console.log('INI SERIES' , chartSeries)
    // chart.updateSeries(chartSeries)    
  },[chartOptions, chartSeries])
  
  const statusFormat = (cell,row) => {    
    return(
      <>
        {row.status_completed === 'ONGOING' ? 
          <p className = 'text-warning m-0 font-weight-bold'>{row.status_completed}</p> 
          :
          <p className = 'text-success m-0 font-weight-bold'>{row.status_completed}</p> 
        } 
      </>
    )
  }

  const columns = [{
    dataField: 'nama',
    text: 'Nama Pelanggan'
  }, {
    dataField: 'completed_task',
    text: 'Task Progress',    
  }, {
    dataField: 'status_completed',
    text: 'Status',
    formatter: statusFormat,    
  }];

  const handleTableChange = (type, { page, sizePerPage }) => {
    setParam((prevState) => ({
      ...prevState,
      page: page
    }))
  }

  return (
    <>            
      <Card>
        <CardBody>
        <Breadcrumb>
            <BreadcrumbItem><a href="/#" onClick={(e) => { e.preventDefault(); history.push('/laporan/gerai') }}>Laporan</a></BreadcrumbItem>            
            <BreadcrumbItem><a href="/#" onClick={(e) => { e.preventDefault(); history.push('/laporan/gerai/task') }}>Task</a></BreadcrumbItem>
            <BreadcrumbItem active>Detail</BreadcrumbItem>
          </Breadcrumb>
          <div className='p-2 rounded bg-light my-2'>
            <h6 className='p-0 font-weight-bold'>{param.nama}</h6>
            <h6 className='m-0 p-0'>{' Level: ' + addCommas(param.level_task)}</h6>
            <h6 className='m-0 p-0'>{' Kuota: ' + addCommas(param.kuota_task)}</h6>
          </div>
          {chartOptions.xaxis.categories.length > 0 ?
            <Chart
              options = {{...chartOptions}}
              series = {[...chartSeries]}
              type = 'bar'
              width = '95%'
              className = 'd-flex justify-content-center'
            />
            : null }
          <BootstrapTable
            remote
            keyField='id_task_customer'
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
            noDataIndication="Belum ada laporan mengenai task ini"
            wrapperClasses="table-responsive"
          />
        </CardBody>        
      </Card>
    </>
  );
}

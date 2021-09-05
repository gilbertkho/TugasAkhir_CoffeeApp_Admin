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
import Chart from 'react-apexcharts';

export default function ListPendaftar() {

  const history = useHistory();
  const [users, setUsers] = useState({});  
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

  const [chartOptions, setChartOptions] = useState({    
      chart:{
        id: "basic-bar"
      },
      xaxis: {
        categories: []
      },
      noData: {
        text: "Data not found."
      }
  })
  const [chartSeries, setChartSeries] = useState([
    {
      name: 'Pemesanan',
      data: []
    },{
      name: 'Task',
      data: []
    },{
      name: 'Komplain',
      data: []
    }

  ])

  function fetchData(param) { 
    console.log(param)
    axios.post('/app/admin/report/gerai', param).then(({data}) => {
        console.log(data.data)
        if (data.status) {
          setUsers(data.data);          
          let series = [...chartSeries];
          let options = {...chartOptions};
          series[0].data.push(parseInt(data.data.total_pesanan));
          series[1].data.push(parseInt(data.data.total_task));
          series[2].data.push(parseInt(data.data.total_komplain));
          options.xaxis.categories.push('Total Pemesanan');
          options.xaxis.categories.push('Total Task');
          options.xaxis.categories.push('Total Komplain');
          setChartSeries(series);
          setChartOptions(options);
        } else {
          toast.error(data.msg, { containerId: 'B', transition: Zoom });
        }
      }).catch(error => {
        console.log(error);
        // if(error.response.status != 500){
        //   toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        // }        
        // else{
        //   toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});
        // }
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

  const handleSearch = (e) => {
    e.preventDefault()
    setParam((prevState) => ({ ...prevState, page: 1, search: searchRef.current.value }))
  }

  return (
    <>      
      <Card>
        <CardBody>
          <CardTitle>Laporan Gerai</CardTitle>          
          <div className = 'my-2 rounded bg-secondary mb-2 px-3 py-2 font-weight-bold'>
            Pemesanan<br/>
            <Button color = "primary" onClick = {() => {history.push('/laporan/gerai/order')}}>
              <h5 className='m-0 '>{users.total_pesanan}</h5>
            </Button>
            <hr/>
            Task<br/>
            <Button color = "primary" onClick = {() => {history.push('/laporan/gerai/task')}}>
              <h5 className='m-0 '>{users.total_task}</h5>
            </Button>
            <hr/>
            Komplain<br/>
            <Button color = "primary" onClick = {() => {history.push('/laporan/gerai/complain')}}>
              <h5 className='m-0 '>{users.total_komplain}</h5>
            </Button>
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
        </CardBody>
      </Card>
    </>
  );
}

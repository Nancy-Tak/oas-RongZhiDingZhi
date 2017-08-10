import React, {
    Component,
    PropTypes
} from 'react';

import {
    Link
} from 'react-router';

// antd 组件
import {
    Form,
    Button,
    Upload,
    Row,
    Col,
    Icon,
    Modal,
    message
} from 'antd';

// 页面组件
import Frame from 'COM/form/frame';

const createForm = Form.create;
const FormItem = Form.Item;

//  引入fetch
import {
    fetch
} from 'UTILS';

//  引入文件链接
import FileUrl from 'PAGES/companyValidate/components/fileUrl';

class DocumentUpload extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            isCommon: true,
            limit: 5,
            fileList: {
                registration: [],
                orgInsCode: [],
                socialCredit: [],
                identityProof: [],
                deletegatePromiseLetter: []
            },
        }

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let me = this;

        //  证件查询
        fetch('/paper/searchCompany.do').then(res => {
            let fileList = me.state.fileList;
            let fileData = res.data;
            for (let prop in fileData) {
                fileData[prop].map((item, index) => {
                    let uid = prop + '_' + new Date() / 1 + '_' + index;
                    let file = {
                        uid: uid,
                        name: item.fileName,
                        status: 'done',
                        url: item.linkUrl,
                        data: item
                    }
                    fileList[prop].push(file);
                })
            }

            me.setState({
                isCommon: !res.data['socialCredit'], //  通过是否拥有社会信用证来判断
                fileList: fileList
            });
        });
    }

    _getFileList(info) {
        // console.log(info);
        if (!this._fileExam(info.file)) {
            //  校验不通过则不返回false
            return false;
        }
        let fileList = info.fileList;

        // 1. 上传列表数量的限制
        //    只显示最近上传的五个，旧的会被新的顶掉
        fileList = fileList.slice(-5);

        // 2. 读取远程路径并显示链接
        fileList = fileList.map((file) => {
            if (file.response) {
                // 组件会将 file.url 作为链接进行展示
                file.url = file.response.data.linkUrl;
            }
            return file;
        });

        // 3. 按照服务器返回信息筛选成功上传的文件
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.code == '200';
            }
            return true;
        });

        return fileList;
    }

    _fileExam(file) {
        // console.log(file);
        let {
            name,
            size
        } = file;
        let reg = new RegExp(/[.](jpg|jpeg|png|bmp)$/);
        if (!reg.test(name)) {
            message.error("文件格式必须为jpg、jpeg、png或bmp");
            return false;
        }

        if (size > 10485760) { //  文件不能大于10M
            message.error("文件大小不能超过10M");
            return false;
        }

        return true;
    }

    _warning() {
        let me = this;
        Modal.warning({
            title: '图片最多上传' + me.state.limit + '张',
            content: '请删除图片后再上传。',
        });
    }

    tipsShow() {
        let me = this;
        Modal.success({
            title: '提示',
            content: '资料修改成功。',
            onOk: me.toCheck.bind(me)
        });
    }

    upLoadChange(info, dataName) {
        if (info.fileList.length > this.state.limit) {
            //  已达五张上限
            this._warning();
            return false;
        }
        let fList = this._getFileList(info);
        if (!fList) {
            return false;
        }
        let fileList = this.state.fileList;
        fileList[dataName] = fList;

        this.setState({
            fileList
        });
    }

    socialCreditChange(info) {
        this.upLoadChange(info, "socialCredit");
    }

    registrationChange(info) {
        this.upLoadChange(info, "registration");
    }

    orgInsCodeChange(info) {
        this.upLoadChange(info, "orgInsCode");
    }

    identityProofChange(info) {
        this.upLoadChange(info, "identityProof");
    }

    deletegatePromiseLetterChange(info) {
        this.upLoadChange(info, "deletegatePromiseLetter");
    }

    submit() {
        let me = this;
        let data = me._getSubmitData();
        console.log(data);
        fetch('/paper/saveCompany.do', {
            body: data
        }).then(res => {
            if (res.code == 200) {
                console.log(res);
                //  提交成功TODO
                me.tipsShow();
            }
        });
    }

    _getSubmitData() {
        let data = {};

        let fileList = this.state.fileList;
        for (let prop in fileList) {
            data[prop] = [];
            fileList[prop].map((item, index) => {
                let file = item.data ? item.data : item.response.data;
                data[prop].push(file);
            })
        }

        return data;
    }

    toCheck() {
        let pathName = this.props.location.query.isEditor == 1 ? "/accountManagement/basicInformation" : '/companyValidate/tips/check';
        this.props.history.push(pathName);
    }

    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        // let rules={
        //        socialCredit:{
        //            rules:[
        //                {required: true, message: '请上传统一社会信用代码证'},
        //            ],
        //            valuePropName: 'fileList',
        //            normalize: this.normFile
        //        },
        // 	registration:{
        //            rules:[
        //                {required: true, message: '请上传营业执照'},
        //            ],
        //            valuePropName: 'fileList',
        //            normalize: this.normFile
        //        },
        //        orgInsCode:{
        //            rules:[
        //                {required: true, message: '请上传组织机构代码证'},
        //            ],
        //            valuePropName: 'fileList',
        //            normalize: this.normFile
        //        },
        //        identityProof:{
        //            rules:[
        //                {required: true, message: '请上传企业法定代表人身份证明书'},
        //            ],
        //            valuePropName: 'fileList',
        //            normalize: this.normFile
        //        },
        //        deletegatePromiseLetter:{
        //            rules:[
        //                {required: true, message: '请上传承诺函及授权委托书'},
        //            ],
        //            valuePropName: 'fileList',
        //            normalize: this.normFile
        //        },
        // };

        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 12
            },
        };
        let url = '/common/fileupload.do';
        const upLoadProps = {
            name: 'file',
            action: __DEV__ ? `/api${url}` : url,
            headers: {
                authorization: 'authorization-text',
            },
            accept: 'image/*'
        };

        const socialCreditUpLoadProps = Object.assign({}, upLoadProps, {
            onChange: this.socialCreditChange.bind(this)
        });
        const registrationUpLoadProps = Object.assign({}, upLoadProps, {
            onChange: this.registrationChange.bind(this)
        });
        const orgInsCodeUpLoadProps = Object.assign({}, upLoadProps, {
            onChange: this.orgInsCodeChange.bind(this)
        });
        const identityProofUpLoadProps = Object.assign({}, upLoadProps, {
            onChange: this.identityProofChange.bind(this)
        });
        const deletegatePromiseLetterUpLoadProps = Object.assign({}, upLoadProps, {
            onChange: this.deletegatePromiseLetterChange.bind(this)
        });

        const {
            getFieldProps
        } = this.props.form;

        return (
            <Frame title="企业证件扫描件" small="(请提供原件照片或彩色扫描件。注：正副本均可。)">
            	<Form horizontal className="fn-mt-30">

                    <div style={ { display : this.state.isCommon ? "block" : "none" } }>
    					<FormItem
    	                    {...formItemLayout}
    	                    label="营业执照"
    	                    required
    	                >
    	                    <Upload {...registrationUpLoadProps} fileList={this.state.fileList.registration}>
    	                        <Button type="ghost">
    	                            <Icon type="upload" /> 点击上传
    	                        </Button>
    	                    </Upload>
    	                </FormItem>

    	                <FormItem
    	                    {...formItemLayout}
    	                    label="组织机构代码证"
    	                    required
                            display={ this.state.isCommon ? "block" : "none" }
    	                >
    	                    <Upload {...orgInsCodeUpLoadProps} fileList={this.state.fileList.orgInsCode}>
    	                        <Button type="ghost">
    	                            <Icon type="upload" /> 点击上传
    	                        </Button>
    	                    </Upload>
    	                </FormItem>
                    </div>

                    <div style={ { display : !this.state.isCommon ? "block" : "none" } }>
                        <FormItem
                            {...formItemLayout}
                            label="统一社会信用代码证"
                            required
                        >
                            <Upload {...socialCreditUpLoadProps} fileList={this.state.fileList.socialCredit}>
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>
                        </FormItem>
                    </div>

	                <FormItem
                        {...formItemLayout}
                        label="上传文件要求"
                    >
                        <ul>
                            <li>证件必须在有效期内且年检章齐全（当年成立的公司可无年检章）。</li>
                            <li>支持格式jpg、jpeg、png、bmp，不超过10M。</li>
                        </ul>
                    </FormItem>

                    <div className="form-title fn-mb-30" style={{borderTop:'1px solid #e8e8e8'}}>
                        其他资料
                        <small className="viceText-FontColor"> (请提供原件照片或彩色扫描件。)</small>
                    </div>

                    <FormItem
                        {...formItemLayout}
                        label=" 企业法定代表人身份证明书"
                        required
                    >
                        <Upload {...identityProofUpLoadProps} fileList={this.state.fileList.identityProof}>
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="上传文件要求"
                    >
                        <ul>
                            <li>下载<a href={ FileUrl.identityProof } download="企业法定代表人身份证明书">《企业法定代表人身份证明书》</a>，打印填写并加盖公章。</li>
                            <li>支持格式jpg、jpeg、png、bmp，不超过10M。</li>
                        </ul>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="承诺函及授权委托书"
                        required
                    >
                        <Upload {...deletegatePromiseLetterUpLoadProps} fileList={this.state.fileList.deletegatePromiseLetter}>
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="上传文件要求"
                    >
                        <ul>
                            <li>下载<a href={ FileUrl.deletegatePromiseLetter } download="承诺函及授权委托书">《承诺函及授权委托书》</a>，打印填写并加盖公章。</li>
                            <li>支持格式jpg、jpeg、png、bmp，不超过10M。</li>
                        </ul>
                    </FormItem>

                    <Row style={{ marginTop: 30 }}>
                        <Col span="12" offset="8">
                            <Button type="primary" onClick={ this.submit.bind(this) }>提交</Button>
                            <Button type="ghost" onClick={ this.toCheck.bind(this) } className="fn-ml-20">暂不修改</Button>
                        </Col>
                    </Row>

	            </Form>
            </Frame>
        );
    }
}

export default createForm()(DocumentUpload);
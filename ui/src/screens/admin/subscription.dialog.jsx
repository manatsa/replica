import {Dialog} from "primereact/dialog";
import {PrimaryColor} from "../../components/Constants.jsx";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login.jsx";
import {useJwt} from "react-jwt";
import {Accordion, AccordionTab} from "primereact/accordion";

const SubscriptionDialog =({visible, setVisible})=>{

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const logins=login && login!=='undefined' ? JSON.parse(login) : null;
    const {data, error, isError, isLoading }=doFetch('/api/subscriptions/active',token,['get','subscription',logins?.userName]);


    return (
        <>
            <Dialog header={()=><div
                style={{width:'90%', backgroundColor:PrimaryColor, padding: '20px', borderRadius:20, color:'white', margin: 10}}
            >{logins?.lastName +' '+logins?.firstName}</div>} visible={visible} onHide={() => setVisible(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                <Accordion activeIndex={0}>
                    {data?.map(item=>{

                        return(
                            <AccordionTab key={item?.id}
                                header={
                                    <div className="flex align-items-center">
                                        <i className="pi pi-calendar mr-2"></i>
                                        <span className="vertical-align-middle font-bold">{item?.period +` Ending: ${new Date(item?.endDate)?.toLocaleString()}`}</span>
                                    </div>
                                }
                            >
                                <div className="grid">
                                    <div className="col-6 md:col-5">
                                        Period
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {item?.period}
                                    </div>
                                    <div className="col-6 md:col-5">
                                        Start Date
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {new Date(item?.startDate)?.toLocaleString()}
                                    </div>
                                    <div className="col-6 md:col-5">
                                        End Date
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {new Date(item?.endDate)?.toLocaleString()}
                                    </div>
                                    <div className="col-6 md:col-5">
                                        Sub Status
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {item?.active?'Active':'Inactive'}
                                    </div>
                                    <div className="col-6 md:col-5">
                                        Date Created
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {item?.dateCreated?.split('T')[0]}
                                    </div>

                                </div>
                            </AccordionTab>
                        )
                    })

                    }
                </Accordion>
            </Dialog>
        </>
    )
}

export default SubscriptionDialog;
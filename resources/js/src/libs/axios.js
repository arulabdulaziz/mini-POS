import Vue from "vue";
import router from "@/router";
import store from "@/store";
import { i18n } from "@/libs/i18n";
// axios
import axios from "axios";
import Swal from "sweetalert2";

// console.log(store, "<< store")
// console.log(`${localStorage.getItem("socketId")} <<<< socket di kirim ke server`)
const axiosIns = axios.create({
    // You can add your headers here
    // ================================
    // baseURL: "http://10.8.0.9/api/",
    baseURL:
        process.env.MIX_APP_ENV === "production"
            ? `${process.env.MIX_BACK_END_URL}api/`
            : process.env.NODE_ENV === "production"
            ? `${process.env.MIX_BACK_END_URL}api/`
            : "https://staging.api.kasirini.id/api/",
    // baseURL:
    //     process.env.MIX_APP_ENV === "production"
    //         ? `${process.env.MIX_BACK_END_URL}api/`
    //         : process.env.NODE_ENV === "production"
    //         ? `${process.env.MIX_BACK_END_URL}api/`
    //         : "https://localhost/api/",
    // baseURL:
    //     process.env.MIX_APP_ENV === "production"
    //         ? `${process.env.MIX_BACK_END_URL}api/`
    //         : process.env.NODE_ENV === "production"
    //         ? `${process.env.MIX_BACK_END_URL}api/`
    //         : "http://192.168.8.216/api/",
    // baseURL:
    //     process.env.MIX_APP_ENV === "production"
    //         ? `${process.env.MIX_BACK_END_URL}api/`
    //         : process.env.NODE_ENV === "production"
    //         ? `${process.env.MIX_BACK_END_URL}api/`
    //         : "http://api.starterkit.com/api/",
    headers: {
        // "X-Socket-ID": store?.state?.socketITd ?? "",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        // type: "web"
    },
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});
// const interceptResErrors = err => {
//     try {
//         // check for response code 123 and redirect to login
//         err = Object.assign(new Error(), { message: err.data });
//         console.log(err, "1<<<");
//     } catch (e) {
//         // check for response code 123 and redirect to login
//         // Will return err if something goes wrong
//         console.log(e, "2<<");
//     }
//     return Promise.reject(err);
// };
const interceptResponse = (res) => {
    try {
        // check for response code 123 and redirect to login
        // console.log(res, "<< rest.data");
        // if (res.status == 401) {
        //     localStorage.removeItem("accessToken");
        //     localStorage.setItem("login_messages", "Sesion Berakhir");
        //     router.push("/login");
        //     // return Promise.reject(res.status);
        // }
        /** res.config.params <- get params
         *
         */
        console.log(res, "3<<");
        return Promise.resolve(res);
    } catch (e) {
        // check for response code 123 and redirect to login
        console.log(e, "4<<");
        return Promise.resolve(res);
    }
};
const interceptResError = (error) => {
    // error.config.params <- get params
    /* buat error table dg cara cek params apakah dia mengirim item_per_page
        jika ya, set vuex error table nya
        jika dia mengirim item_per_page lagi dan ternyata sukses, set error di vuex nya null
    */
    // console.log(JSON.stringify(error), "<< error from interceptor");
    if (error.message == "Network Error") {
        error.response = {
            data: {
                success: false,
                errors: [
                    {
                        message: "No Internet Connection",
                        messageId: "Tidak ada Koneksi Internet",
                    },
                ],
            },
        };
    }
    // if (!error.response) {
    //     return Promise.reject(error);
    // }
    // const { status } = error.response;
    // console.log(error.response, "<< error2");
    // if (status === 401) {
    //     store.dispatch("logout", {
    //         loginMessage: "Session Berakhir",
    //         isFromServer: true,
    //     });
    //     return Promise.reject(error);
    // }
    // if (status === 413) {
    //     error.response = {
    //         data: {
    //             success: false,
    //             errors: [
    //                 {
    //                     message: "File too large",
    //                     messageId: "File terlalu besar",
    //                 },
    //             ],
    //         },
    //     };
    // }
    // if (
    //     error.response.data.success != undefined &&
    //     error.response.data.success != null
    // ) {
    //     if (error.response.data.errors[0].errorCode == 401000) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             // text: i18n.t("Access Denied Error", {
    //             //     access: i18n.t(
    //             //         "access." + error.response.data.errors[0].data
    //             //     ),
    //             // }),
    //             html: `<p>${i18n.t("Access Denied Error")} <strong>"${i18n.t(
    //                 "access." + error.response.data.errors[0].data
    //             )}"</strong></p>`,
    //         });
    //         error.response = {
    //             data: {
    //                 success: false,
    //                 errors: [
    //                     {
    //                         message: i18n.t("Access Denied Error", {
    //                             access: i18n.t(
    //                                 "access." +
    //                                     error.response.data.errors[0].data
    //                             ),
    //                         }),
    //                         messageId: i18n.t("Access Denied Error", {
    //                             access: i18n.t(
    //                                 "access." +
    //                                     error.response.data.errors[0].data
    //                             ),
    //                         }),
    //                         errorCode: 401000,
    //                         data: error.response.data.errors[0].data,
    //                     },
    //                 ],
    //             },
    //         };
    //         return Promise.reject(error);
    //     } else if (error.response.data.errors[0].errorCode == 411001) {
    //         // email
    //         router.push("/email-verification").catch((err) => {});
    //         return Promise.reject(error);
    //     } else if (error.response.data.errors[0].errorCode == 412001) {
    //         router.push("/phone-verification").catch((err) => {});
    //         return Promise.reject(error);
    //         // 402001
    //         // 420000
    //     } else if (error.response.data.errors[0].errorCode == 420000) {
    //         router.push("/outlet-add").catch((err) => {});
    //         return Promise.reject(error);
    //     } else if (error.response.data.errors[0].errorCode == 420002) {
    //         router.push("/waiting-access").catch((err) => {});
    //         return Promise.reject(error);
    //     }
    // }
    return Promise.reject(error);
};
axiosIns.interceptors.response.use(interceptResponse, interceptResError);

/* Request Interceptors */
const interceptReqErrors = (err) => Promise.reject(err);
const interceptRequest = (config) => {
    return config;
};
axiosIns.interceptors.request.use((config) => {
    // Do something before request is sent
    // cek apakah dia ngirim item_per_page set vuex error table null
    console.log(config, "5<<");
    config.headers["X-Socket-ID"] = window.Echo.socketId();
    return config;
}, interceptReqErrors);
Vue.prototype.$http = axiosIns;
export default axiosIns;

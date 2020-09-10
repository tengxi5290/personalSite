if('serviceWorker' in navigator){
    // navigator.serviceWorker.register('./service-worker.js').then((data)=>{
    //     console.log(data)
    //     console.log('sw注册成功')
    // }).catch(()=>{console.log('sw注册失败')})

    navigator.serviceWorker.getRegistrations().then(function (registration) {
      for (let item of registration) {
        item.unregister()
      }
    })
}

/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import java.io.ObjectOutputStream;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Set;

import org.cocos2dx.javascript.DeviceSearcher.DeviceBean;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.util.Log;

public class AppActivity extends Cocos2dxActivity {
	static AppActivity app = null;
    private static final String TAG = DeviceSearcher.class.getSimpleName();
	
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
    	app = this;
    	
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        return glSurfaceView;
    }
    
    // 主机——demo核心代码 (加入)
    private ArrayList<DeviceBean> mDeviceList = new ArrayList<DeviceBean>();
    public static void searchDevices() {
    	app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                 new DeviceSearcher() {
                        @Override
                        public void onSearchStart() {
                            startSearch(); // 主要用于在UI上展示正在搜索
                        }

                        @Override
                        public void onSearchFinish(Set deviceSet) {
                            endSearch(); // 结束UI上的正在搜索

                            app.mDeviceList.clear();
                            app.mDeviceList.addAll(deviceSet);
                            //mHandler.sendEmptyMessage(0); // 在UI上更新设备列表
                        }
                 }.start();
            }
        });
    }
    
    private static void startSearch() {
    	Log.i(TAG, "开始搜索");
    }

    private static void endSearch() {
    	Log.i(TAG, "结束搜索");
    }
    
    // 设备——demo核心代码 (创建)
    public static void waitSearch() {
    	 app.runOnUiThread(new Runnable() {
             @Override
             public void run() {
                new DeviceWaitingSearch(app, "日灯光", "客厅"){
                    @Override
                    public void onDeviceSearched(InetSocketAddress socketAddr) {
                        //pushMsgToMain("已上线，搜索主机：" + socketAddr.getAddress().getHostAddress() + ":" + socketAddr.getPort());
                        Log.i(TAG, "已上线，搜索主机：" + socketAddr.getAddress().getHostAddress() + ":" + socketAddr.getPort());
                    }
                }.start();
             }
         });
    }
    
//    private void ClientrecMsg(Chessman c) {
//    	try {  
//    		//Socket socket = new Socket(ip, port);  
//    		//建立输入流  
//    		ObjectOutputStream oos = new ObjectOutputStream(socket.getOutputStream());   
//    		//输入对象, 一定要flush
//    		oos.writeObject(c);
//    		oos.flush();        
//    		oos.close();  
//    		//socket.close();  
//    	} 
//    	catch (UnknownHostException e) {  
//    		e.printStackTrace();
//    	}
//    }

}

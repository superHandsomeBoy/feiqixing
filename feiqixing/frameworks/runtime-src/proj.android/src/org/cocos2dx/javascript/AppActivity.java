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

import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

public class AppActivity extends Cocos2dxActivity {
	static AppActivity app = null;
    private static final String TAG = DeviceSearcher.class.getSimpleName();
    public static final int DEVICE_FIND_PORT = 9000;
    
    private static MainServer server;
    private static MainClient client;
    public static String myIp;
    
    private static ArrayList<String> _serverIps = new ArrayList<String>();
    private static ArrayList<Integer> _serverPorts = new ArrayList<Integer>();
	
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
    	app = this;
    	
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        
        myIp = getOwnWifiIP();

        return glSurfaceView;
    }
    
    // 搜索房间
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

                         _serverIps.clear();
                         _serverPorts.clear();
                         
                         Iterator<DeviceBean> value = deviceSet.iterator();
                         while (value.hasNext()) {
                         	DeviceBean s = value.next();
                         	
                         	_serverIps.add(s.getIp());
                         	_serverPorts.add(s.getPort());
                         }
                         
                         app.runOnGLThread(new Runnable() {
                 			@Override
                 			public void run() {
                 				String str_ip = "";
                 				for (int i = 0; i < _serverIps.size(); i++) {
                 					if (i > 0) {
                 						str_ip += ",";
                 					}
                 					str_ip += _serverIps.get(i);
                 				}
                 				
                               Cocos2dxJavascriptJavaBridge.evalString("EnterScene.instance.showRoom('"+ str_ip +"')");
                 			}
                 		});
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
    
    // 选择房间
    public static void selectRoom(final String ip) {
    	 app.runOnUiThread(new Runnable() {
             @Override
             public void run() {
             	System.out.println("link server " + ip);
             	
             	client = new MainClient(ip);
             }
    	 });
    }
    
    // 创建房间
    public static void waitSearch() {
    	 app.runOnUiThread(new Runnable() {
             @Override
             public void run() {

            	 server = new MainServer(myIp);
            	 client = new MainClient(myIp);
            	 
                new DeviceWaitingSearch(app, "玩家1", "1号房"){
                    @Override
                    public void onDeviceSearched(InetSocketAddress socketAddr) {
                        //pushMsgToMain("已上线，搜索主机：" + socketAddr.getAddress().getHostAddress() + ":" + socketAddr.getPort());
                        Log.i(TAG, "已上线，搜索主机：" + socketAddr.getAddress().getHostAddress() + ":" + socketAddr.getPort());
                    }
                }.start();
                
//                try {
//					Thread.sleep(50);
//	            	 client = new MainClient(myIp);
//				} catch (InterruptedException e) {
//					e.printStackTrace();
//				}
             }
         });
    }
    
    // 更新房间成员
    public void updateIps(final String ips) {
    	app.runOnGLThread(new Runnable() {
 			@Override
 			public void run() {
 				 Cocos2dxJavascriptJavaBridge.evalString("EnterScene.instance.updateRoom('"+ ips +"')");
 			}
 		});
    };
    
    // 获取本机IP
    public static String getMyIp() {
    	return myIp;
    };
    
    // 选择颜色
    public static void selectColor(final int index) {
    	app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
            	client.sendToServer("03" + myIp + "," +  index);
            }
    	});
    }

    /**
     * 获取本机在Wifi中的IP
     */
    public String getOwnWifiIP() {
        WifiManager wm = (WifiManager) app.getSystemService(Context.WIFI_SERVICE);
        if (!wm.isWifiEnabled()) {
            return "";
        }

        // 需加权限：android.permission.ACCESS_WIFI_STATE
        WifiInfo wifiInfo = wm.getConnectionInfo();
        int ipInt = wifiInfo.getIpAddress();
        String ipAddr = int2Ip(ipInt);
        Log.i(TAG, "本机IP=" + ipAddr);
        return int2Ip(ipInt);
    }

    /**
     * 把int表示的ip转换成字符串ip
     */
    public String int2Ip(int i) {
        return String.format("%d.%d.%d.%d", i & 0xFF, (i >> 8) & 0xFF, (i >> 16) & 0xFF, (i >> 24) & 0xFF);
    }

}

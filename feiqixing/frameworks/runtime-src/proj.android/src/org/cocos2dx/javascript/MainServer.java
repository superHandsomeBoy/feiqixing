package org.cocos2dx.javascript;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class MainServer {

	public static MainServer app;
	private ServerSocket serverSocket;
	private Socket socket;
    private String _serverIp;
    private ArrayList<String> _allIps = new ArrayList<String>();
    private ArrayList<PrintWriter> pWriters = new ArrayList<PrintWriter>();
	
	public MainServer(String ip) {
		app = this;

//	   	 _allIps.clear();
		for(int i = 0; i < 4; i++) {
			_allIps.add("");
		}
	   	 _serverIp = ip;

    	 try {
			serverSocket = new ServerSocket(AppActivity.DEVICE_FIND_PORT);
		} catch (IOException e) {
			e.printStackTrace();
		}

         //创建接受客户端Socket读线程实例，并启动
           new AcceptSocketThread().start();
	}
	
	//接收客户端Socket套接字线程
    class AcceptSocketThread extends Thread{

		public void run() {
            while(this.isAlive()) {
                try {
                    //接收一个客户端Socket对象
                    Socket socket = serverSocket.accept();
                    //建立该客户端读通信管道
                    if(socket != null) {
                        //获取Socket对象读输入流
                    	BufferedReader bReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

                      //开启一个线程接收客户端读聊天信息
                        new GetMsgFromClient(bReader).start();
                        
                        //获取Socket对象读输出流，并添加到输入流列表集合中
                        pWriters.add(new PrintWriter(socket.getOutputStream()));
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
        }
    }
    
  //接收客户端读聊天信息读线程
    class GetMsgFromClient extends Thread{
        BufferedReader bReader;

        public GetMsgFromClient(BufferedReader bReader) {
            this.bReader = bReader;
        }

        public void run() {
            while(this.isAlive()) {
                String strMsg;
                try {
                    strMsg = bReader.readLine();
                    if(strMsg != null) {
                        checkMessage(strMsg);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }

	//向client发送消息
    public void sendToCilent(String str) {
    	System.out.println("send to client: " + str);
    	
    	for (int i = 0; i < pWriters.size(); i++) {
    		pWriters.get(i).println(str);
    		pWriters.get(i).flush();
        }
    }
	
	// 解析收到的消息
	private void checkMessage(String msg) {
        System.out.println("server get msg: " + msg);
        
        String objString = msg.toString();
    	String type = objString.substring(0, 2);
    	String str = objString.substring(2);
    	
//    	System.out.println("type: " + type);
//    	System.out.println("str: " + str);

    	if (type.equals("01")) {		// 添加成员
    		for(int i = 0; i < _allIps.size(); i++) {
				if (_allIps.get(i).isEmpty()) {
					_allIps.set(i, str);
					break;
				}
			}
        	app.updateSendIps();
        	
    	} else if (type.equals("03")) {		// 换颜色
    		String[] msg2 = str.split(",");
			for(int i = 0; i < _allIps.size(); i++) {
				if(_allIps.get(i).equals(msg2[0])) {
					int index = Integer.parseInt(msg2[1]);
					if (_allIps.get(index).isEmpty()) {
						_allIps.set(index, msg2[0]);
						_allIps.set(i, "");
					}
				}
			}
        	app.updateSendIps();
    	}
	}

    // 发送 更新房间人员
    public void updateSendIps() {
    	String ips = "";
    	int len = _allIps.size();
    	for(int i = 0; i < len; i++) {
    		ips += _allIps.get(i);
    		if (i < len - 1) {
    			ips += ",";
    		}
    	}
    	
    	sendToCilent("02" + ips);
    };
}

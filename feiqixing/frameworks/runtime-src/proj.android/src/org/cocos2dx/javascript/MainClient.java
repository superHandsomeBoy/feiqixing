package org.cocos2dx.javascript;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.ArrayList;

public class MainClient {
	
	public static MainClient app;
	private Socket socket;
    private String _serverIp;
    private ArrayList<String> _allIps = new ArrayList<String>();
	private BufferedReader bReader;
	private PrintWriter pWriter;

	public MainClient(String ip) {
		app = this;
		_serverIp = ip;
		
		 try {
             //连接服务器 并设置连接超时为5秒
             socket = new Socket();
             socket.connect(new InetSocketAddress(_serverIp, AppActivity.DEVICE_FIND_PORT), 5000);

             //创建一个往套接字中写数据的管道，即输出流，给服务器发送信息
             pWriter = new PrintWriter(socket.getOutputStream());
             //创建一个聪套接字读数据的管道，即输入流，读服务器读返回信息
             bReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

         }catch (IOException e) {
             e.printStackTrace();
         }
		 
		//启动线程
	    new GetMsgFromServer().start();

	    try {
			Thread.sleep(50);
	        joinServer();
		} catch (Exception e) {
			 e.printStackTrace();
		}
	}
	
	//接受服务器读返回信息读线程
    class GetMsgFromServer extends Thread{
        @Override
        public void run() {
            while (this.isAlive()) {
                try {
                    String strMsg = bReader.readLine();
                    if(strMsg != null) {
                        checkMessage(strMsg);
                    }
                    Thread.sleep(50);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
	
	//向server发送消息
    public void sendToServer(String str) {
    	System.out.println("send to server: " + str);
    	
    	pWriter.println(str);
    	pWriter.flush();
    }

    // 加入服务器
    private void joinServer() {
    	sendToServer("01" + AppActivity.myIp);
    }
	
	// 解析收到的消息
	private void checkMessage(String msg) {
        System.out.println("client get msg: " + msg);
        
        String objString = msg.toString();
    	String type = objString.substring(0, 2);
    	String str = objString.substring(2);
    	
//    	System.out.println("type: " + type);
//    	System.out.println("str: " + str);
    	
    	if (type.equals("02")) {				// 更新房间成员
    		AppActivity.app.updateIps(str);
    		
    	} else if (type.equals("04")) {		// 开始游戏
    		AppActivity.app.startGame();
    	} else if (type.equals("05")) {		// 显示当前行动者
    		AppActivity.app.showNowPlayer(str);
    	} else if (type.equals("06")) {		// 步数
    		AppActivity.app.showStep(str);
    	} else if (type.equals("07")) {		// 选择行走棋子
    		AppActivity.app.moveSeZiOpp(str);
    	} else if (type.equals("09")) {		// 玩家结束数组
    		AppActivity.app.playerWin(str);
    	}
	}
}

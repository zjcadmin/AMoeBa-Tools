package com.ioally.amoeba.tasks;

import com.ioally.amoeba.dto.AMoeBaLogDto;
import com.ioally.amoeba.dto.BaseRequestDto;
import com.ioally.amoeba.session.AMoeBaSession;
import com.ioally.amoeba.session.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AMoeBaExecuteThread extends Thread {

    private static final Logger LOGGER = LoggerFactory.getLogger(AMoeBaExecuteThread.class);
    private AMoeBaSession aMoeBaSession;
    private AMoeBaLogDto[] aMoeBaLogDto;
    private String type;
    private Session session;

    private AMoeBaExecuteThread(AMoeBaSession aMoeBaSession, String type, AMoeBaLogDto... aMoeBaLogDto) {
        this.aMoeBaSession = aMoeBaSession;
        this.aMoeBaLogDto = aMoeBaLogDto;
        this.type = type;
    }

    public static AMoeBaExecuteThread instance(AMoeBaSession aMoeBaSession, String type, AMoeBaLogDto... aMoeBaLogDto) {
        return new AMoeBaExecuteThread(aMoeBaSession, type, aMoeBaLogDto);
    }

    @Override
    public void run() {
        try {
            if (session != null) BaseRequestDto.sessionThreadLocal.set(session);
            for (AMoeBaLogDto moeBaLogDto : aMoeBaLogDto) {
                aMoeBaSession.executeAMoeBaLog(moeBaLogDto, type);
            }
        } catch (InterruptedException e) {
            LOGGER.error("线程任务执行错误！", e);
        }
    }

    public AMoeBaExecuteThread session(Session session) {
        this.session = session;
        return this;
    }

    public void execute() {
        start();
    }
}

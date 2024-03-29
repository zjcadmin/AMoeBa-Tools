-- 用户信息表
CREATE TABLE USERINFO
(
    ID        VARCHAR PRIMARY KEY NOT NULL,
    USERNAME  VARCHAR             NOT NULL,
    PASSWORD  VARCHAR             NOT NULL,
    VALIDFLAG VARCHAR             NOT NULL default '1',
    ROLE      VARCHAR             NOT NULL default '9',
    KEY       VARCHAR             NOT NULL
);
-- 角色信息表
CREATE TABLE ROLEINFO
(
    ROLECODE  VARCHAR PRIMARY KEY NOT NULL,
    ROLENAME  VARCHAR             NOT NULL,
    VALIDFLAG VARCHAR             NOT NULL default '1'
);
-- 系统菜单信息
CREATE TABLE SYSMENU
(
    ROLE      VARCHAR NOT NULL,
    MENUID    INTEGER NOT NULL,
    MENUNAME  VARCHAR NOT NULL,
    TARGETURL VARCHAR NOT NULL,
    MENUICON  VARCHAR NOT NULL default '',
    VALIDFLAG VARCHAR NOT NULL DEFAULT '1',
    PRIMARY KEY (ROLE, MENUID)
);
-- 节假日表
CREATE TABLE HOLIDAYMAIN
(
    HOLIDAYID       INTEGER,
    HOLIDAYYEAR     INTEGER,
    HOLIDAYNAME     VARCHAR,
    HOLIDAYSTRATEGY VARCHAR,
    HOLIDAYDAYS     INTEGER,
    PRIMARY KEY (HOLIDAYID, HOLIDAYYEAR)
);
-- 节假日安排表
CREATE TABLE HOLIDAYPLAN
(
    HOLIDAYID   INTEGER,
    HOLIDAYDATE DATE,
    PRIMARY KEY (HOLIDAYID, HOLIDAYDATE)
);

-- 反馈信息表
CREATE TABLE FEEDBACK
(
    ID         VARCHAR NOT NULL
        CONSTRAINT FEEDBACK_PK
            PRIMARY KEY,
    CONTENT    VARCHAR NOT NULL,
    CREATEBY   VARCHAR NOT NULL,
    CREATETIME VARCHAR NOT NULL,
    EMAIL      VARCHAR,
    ISSENDFLAG VARCHAR DEFAULT '0'
);
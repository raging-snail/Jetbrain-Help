package com.jetbrains.help;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.jetbrains.help.context.*;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Import;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.net.InetAddress;

@Slf4j
@EnableScheduling
@Import(SpringUtil.class)
@SpringBootApplication
public class JetbrainsHelpApplication {

    public static void main(String[] args) {
        SpringApplication.run(JetbrainsHelpApplication.class, args);
    }

    @SneakyThrows
    @EventListener(ApplicationReadyEvent.class)
    public void ready() {
        ProductsContextHolder.init();
        PluginsContextHolder.init();
        CertificateContextHolder.init();
        AgentContextHolder.init();
    }

    @Scheduled(cron = "0 0 12 * * ?")
    public void refresh() {
        PluginsContextHolder.refreshJsonFile();
    }

}

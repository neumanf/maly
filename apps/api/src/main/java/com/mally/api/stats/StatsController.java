package com.mally.api.stats;

import com.mally.api.auth.AuthenticationManager;
import com.mally.api.auth.UserJwt;
import com.mally.api.shared.rest.dtos.ApiResponse;
import com.mally.api.stats.services.StatsService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/stats")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/dashboard")
    public ApiResponse getDashboardStats() {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElseThrow();

        return ApiResponse.success(null, statsService.getDashboardStats(userId.value()));
    }
}
